// src/app/api/links/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const links = await prisma.link.findMany({
      select: {
        code: true,
        clicks: true,
      },
    });
    return NextResponse.json(links);
  } catch (error) {
    console.error('Failed to fetch links:', error);
    return NextResponse.json([], { status: 500 });
  }
}