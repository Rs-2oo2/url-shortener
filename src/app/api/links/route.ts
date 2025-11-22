// src/app/api/links/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const links = await prisma.link.findMany({
    select: { code: true, clicks: true },
  });
  return NextResponse.json(links);
}