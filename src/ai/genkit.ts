/**
 * @fileoverview This file initializes a singleton Genkit AI instance.
 *
 * It should be imported by any file that needs to interact with Genkit.
 */
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiVersion: ['v1beta'],
    }),
  ],
});
