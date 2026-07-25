import { NextResponse } from 'next/server';
import { API_ROUTES } from '@cbc/config/routes';

/**
 * Resolve context.
 * @returns {
 *   tenant: Tenant;
 *   country: Country;
 *   region: Region;
 * }
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  try {
    const response = await fetch(`${baseUrl}${API_ROUTES.context}`, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to resolve context' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Context service unavailable' },
      { status: 503 }
    );
  }
}
