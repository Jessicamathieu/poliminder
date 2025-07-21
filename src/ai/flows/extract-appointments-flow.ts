
'use server';
/**
 * @fileOverview Un flux IA pour extraire les détails des rendez-vous à partir d'une image d'agenda.
 *
 * - extractAppointments - Une fonction qui gère le processus d'extraction et de sauvegarde des rendez-vous.
 * - ExtractAppointmentsInput - Le type d'entrée pour la fonction extractAppointments.
 * - ExtractAppointmentsOutput - Le type de retour pour la fonction extractAppointments.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp, getDocs, query, where } from 'firebase/firestore';
import { add, formatISO, parse } from 'date-fns';

const ExtractAppointmentsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "Une photo d'un agenda, sous forme d'URI de données qui doit inclure un type MIME et utiliser l'encodage Base64. Format attendu : 'data:<mimetype>;base64,<encoded_data>'."
    ),
  currentYear: z.number().describe("L'année actuelle pour aider à l'interprétation des dates."),
});
export type ExtractAppointmentsInput = z.infer<typeof ExtractAppointmentsInputSchema>;

const AppointmentSchema = z.object({
    clientName: z.string().describe("Le nom du client pour le rendez-vous."),
    service: z.string().describe("Le service ou la tâche à effectuer."),
    date: z.string().describe("La date du rendez-vous au format JJ-MM. N'incluez pas l'année."),
    time: z.string().describe("L'heure de début du rendez-vous au format HH:mm (24h)."),
});

const ExtractAppointmentsOutputSchema = z.object({
  appointments: z.array(AppointmentSchema).describe("Une liste des rendez-vous extraits de l'image."),
});
export type ExtractAppointmentsOutput = z.infer<typeof ExtractAppointmentsOutputSchema>;

const prompt = ai.definePrompt({
    name: 'extractAppointmentsPrompt',
    input: { schema: ExtractAppointmentsInputSchema },
    output: { schema: ExtractAppointmentsOutputSchema },
    prompt: `Tu es un assistant expert dans l'analyse d'agendas manuscrits ou imprimés. Analyse l'image fournie et extrais tous les rendez-vous que tu peux y trouver.

Instructions importantes :
1.  Pour chaque rendez-vous, identifie le nom du client, le service ou la tâche, la date et l'heure.
2.  Formate la date en JJ-MM. Ignore l'année. L'année de référence est {{{currentYear}}}.
3.  Formate l'heure en format 24 heures (HH:mm). Par exemple, 2pm devient 14:00.
4.  Si un rendez-vous n'a pas d'heure claire, estime-la en fonction de sa position dans la journée (matin ~09:00, après-midi ~14:00).
5.  Ignore les ratures ou les rendez-vous clairement annulés.
6.  Retourne uniquement les rendez-vous que tu peux clairement identifier. Il vaut mieux ne rien retourner qu'inventer.

Analyse l'agenda suivant :
{{media url=photoDataUri}}`,
});

const extractAppointmentsFlow = ai.defineFlow(
    {
        name: 'extractAppointmentsFlow',
        inputSchema: ExtractAppointmentsInputSchema,
        outputSchema: ExtractAppointmentsOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        if (!output) {
            return { appointments: [] };
        }
        return output;
    }
);

// Wrapper function to be called from the client
export async function extractAppointments(input: ExtractAppointmentsInput): Promise<ExtractAppointmentsOutput> {
  const extractedData = await extractAppointmentsFlow(input);

  if (!extractedData || extractedData.appointments.length === 0) {
    console.log("Aucun rendez-vous extrait par l'IA.");
    return { appointments: [] };
  }

  // Save the extracted data to Firestore
  const appointmentsCollection = collection(db, "appointments");

  for (const appt of extractedData.appointments) {
    try {
      const dateStr = `${appt.date}-${input.currentYear} ${appt.time}`;
      const startDateTime = parse(dateStr, 'dd-MM-yyyy HH:mm', new Date());

      if (isNaN(startDateTime.getTime())) {
        console.warn(`Date invalide pour le rendez-vous, ignoré :`, appt);
        continue;
      }
      
      // Placeholder pour la durée, à améliorer potentiellement
      const durationMinutes = 60; 
      const endDateTime = add(startDateTime, { minutes: durationMinutes });

      // Recherche un client existant pour éviter de créer des doublons
      const clientsRef = collection(db, "clients");
      const q = query(clientsRef, where("name", "==", appt.clientName));
      const querySnapshot = await getDocs(q);
      
      let clientData = {
          id: '',
          name: appt.clientName,
          phone: "N/A",
          address: "N/A",
      };

      if (!querySnapshot.empty) {
        const clientDoc = querySnapshot.docs[0];
        clientData.id = clientDoc.id;
        clientData.phone = clientDoc.data().phone || "N/A";
        clientData.address = clientDoc.data().address || "N/A";
      } else {
        // Optionnel : créer un nouveau client s'il n'existe pas
        const newClient = {
            name: appt.clientName,
            email: 'N/A',
            phone: 'N/A',
            address: 'N/A',
            createdAt: Timestamp.now(),
            activeProjects: 1,
            source: 'AI-Extraction'
        };
        const docRef = await addDoc(clientsRef, newClient);
        clientData.id = docRef.id;
      }

      await addDoc(appointmentsCollection, {
        clientId: clientData.id,
        clientName: clientData.name,
        clientPhone: clientData.phone,
        clientAddress: clientData.address,
        serviceIds: [],
        serviceNames: [appt.service],
        start: Timestamp.fromDate(startDateTime),
        end: Timestamp.fromDate(endDateTime),
        status: "À venir",
        createdAt: Timestamp.now(),
        source: 'AI-Extraction',
      });

    } catch (error) {
        console.error("Erreur lors de la sauvegarde d'un rendez-vous :", error, appt);
    }
  }
  
  return extractedData;
}
