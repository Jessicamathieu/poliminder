// /src/app/api/quickbooks/clients/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { temporaryTokenStore } from '@/lib/quickbooks-token-store';

const qboApiBaseUrl = 'https://sandbox-quickbooks.api.intuit.com/v3/company';

export async function GET(req: NextRequest) {
    const tokens = temporaryTokenStore.getTokens();

    if (!tokens || !tokens.accessToken || !tokens.realmId) {
        return NextResponse.json(
            { error: 'Not authenticated with QuickBooks. Please connect first.' },
            { status: 401 }
        );
    }
    
    // Check if the token is expired (we'll implement refresh logic later)
    if (Date.now() > tokens.expiresAt) {
         return NextResponse.json(
            { error: 'Access token expired. Please reconnect.' },
            { status: 401 }
        );
    }

    const { realmId, accessToken } = tokens;
    const query = "SELECT * FROM Customer";
    const url = `${qboApiBaseUrl}/${realmId}/query?query=${encodeURIComponent(query)}`;

    try {
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
