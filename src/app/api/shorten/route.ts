import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  const { url } = await request.json();

  if (!url || !url.startsWith('http')) {
    return NextResponse.json({ error: 'Valid URL required' }, { status: 400 });
  }

  const code = nanoid(7); // e.g., AbCdE12

  await prisma.link.create({
    data: {
      code,
      url,
    },
  });

  const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${code}`;

  return NextResponse.json({ shortUrl, code });
}