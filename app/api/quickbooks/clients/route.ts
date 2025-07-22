import { NextRequest, NextResponse } from 'next/server'
import { getValidQuickBooksToken } from '@/lib/firestore/quickbooks-actions'

const qboApiBaseUrl = 'https://sandbox-quickbooks.api.intuit.com/v3/company'

export async function GET(req: NextRequest) {
  const realmId = req.nextUrl.searchParams.get('realmId')
  if (!realmId) {
    return NextResponse.json({ error: 'Missing realmId' }, { status: 400 })
  }

  try {
    const token = await getValidQuickBooksToken(realmId)
    return NextResponse.json({ token })
  } catch (err) {
    console.error('Failed to fetch QuickBooks token:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}