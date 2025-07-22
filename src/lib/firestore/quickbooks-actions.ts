// 'use server'

// import { db } from "@/lib/firebase-admin";
// import { Client } from "@/lib/types";
// import { collection, getDocs, writeBatch } from "firebase/firestore";
// import QuickBooks from 'node-quickbooks';

// const getQuickBooksToken = async () => {
//     const tokenRef = db.collection('quickbooks_tokens').doc('token');
//     const doc = await tokenRef.get();
//     if (!doc.exists) {
//         throw new Error('QuickBooks token not found.');
//     }
//     return doc.data();
// };

// const getQbo = async () => {
//     try {
//         const token = await getQuickBooksToken();
//         const qbo = new QuickBooks(
//             process.env.QUICKBOOKS_CLIENT_ID,
//             process.env.QUICKBOOKS_CLIENT_SECRET,
//             token?.accessToken,
//             false, // no token secret for oAuth 2.0
//             token?.realmId,
//             true, // use sandbox
//             false, // enable debugging
//             null, // minor version
//             '2.0', // oAuth version
//             token?.refreshToken
//         );
//         return qbo;
//     } catch (err) {
//         console.error('Failed to initialize QuickBooks:', err);
//         throw new Error('Could not connect to QuickBooks.');
//     }
// };

// export const fetchQuickBooksClients = async (): Promise<any[]> => {
//     // const qbo = await getQbo();
//     // return new Promise((resolve, reject) => {
//     //     qbo.findCustomers({}, (err, customers) => {
//     //         if (err) {
//     //             console.error('Failed to fetch QuickBooks customers:', err);
//     //             return reject(err);
//     //         }
//     //         resolve(customers.QueryResponse.Customer || []);
//     //     });
//     // });
//     console.log("QuickBooks client fetch is disabled.");
//     return [];
// };

// export const importQuickBooksClientsToFirestore = async (clients: any[]) => {
//     // const batch = writeBatch(db);
//     // const clientsRef = collection(db, "clients");
//     // const existingClientsSnapshot = await getDocs(clientsRef);
//     // const existingClientIds = new Set(existingClientsSnapshot.docs.map(doc => doc.data().quickbooksId));

//     // clients.forEach((client: any) => {
//     //     if (!existingClientIds.has(client.Id)) {
//     //         const newClientRef = db.collection("clients").doc();
//     //         const newClient: Omit<Client, 'id'> = {
//     //             name: client.DisplayName,
//     //             email: client.PrimaryEmailAddr?.Address || 'N/A',
//     //             phone: client.PrimaryPhone?.FreeFormNumber || 'N/A',
//     //             address: client.BillAddr ? `${client.BillAddr.Line1}, ${client.BillAddr.City}` : 'N/A',
//     //             activeProjects: 0,
//     //             source: 'QuickBooks',
//     //             quickbooksId: client.Id
//     //         };
//     //         batch.set(newClientRef, newClient);
//     //     }
//     // });

//     // await batch.commit();
//     console.log("QuickBooks client import is disabled.");
//     return { count: 0 };
// };

// export const disconnectQuickBooks = async () => {
//     // const tokenRef = db.collection('quickbooks_tokens').doc('token');
//     // await tokenRef.delete();
//     console.log("QuickBooks disconnect is disabled.");
// };

// export const checkQuickBooksConnection = async (): Promise<boolean> => {
//     // try {
//     //     const token = await getQuickBooksToken();
//     //     return !!token;
//     // } catch (error) {
//     //     return false;
//     // }
//      return false;
// };
