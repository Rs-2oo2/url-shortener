// src/app/api/click/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    await prisma.link.update({
      where: { code },
      data: { clicks: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Click tracking failed:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}