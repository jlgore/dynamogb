// app/api/not_found/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({ message: 'Not Found' }, { status: 404 });
}