import { NextRequest, NextResponse } from 'next/server';
import { getValidQuickBooksToken } from '@/lib/firestore/quickbooks-actions';
import { db } from '@/lib/firebase-admin';

const qboApiBaseUrl = 'https://sandbox-quickbooks.api.intuit.com/v3/company';

export async function GET(req: NextRequest) {
    if (!db) {
        console.warn('❌ Firestore is not available (firebase-admin not initialized)');
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      }
    try {
        const tokenData = await getValidQuickBooksToken();

        if (!tokenData || !tokenData.accessToken || !tokenData.realmId) {
            return NextResponse.json(
                { error: 'Not authenticated with QuickBooks. Please connect first.' },
                { status: 401 }
            );
        }
        
        const { realmId, accessToken } = tokenData;
        const query = "SELECT * FROM Customer";
        const url = `${qboApiBaseUrl}/${realmId}/query?query=${encodeURIComponent(query)}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error('QuickBooks API Error:', errorBody);
            return NextResponse.json(
                { error: 'Failed to fetch clients from QuickBooks.', details: errorBody },
                { status: response.status }
            );
        }

        const data = await response.json();
        const customers = data?.QueryResponse?.Customer || [];

        return NextResponse.json(customers);

    } catch (error) {
        console.error('Error fetching from QuickBooks:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
