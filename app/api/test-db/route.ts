import { testDatabaseConnection } from 'lib/dal';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await testDatabaseConnection();
    return NextResponse.json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('API route error:', errorMessage);
    return NextResponse.json(
      { status: 'error', message: errorMessage },
      { status: 500 }
    );
  }
} 