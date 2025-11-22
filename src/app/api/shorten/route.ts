// src/app/api/shorten/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { nanoid } from 'nanoid';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function POST(req: Request) {
  const { url } = await req.json();

  if (!url || !url.startsWith('http')) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  const code = nanoid(7);

  // Just create — don't upsert (simpler & faster)
  const link = await prisma.link.create({
    data: {
      code,
      url,
    },
  });

  const shortUrl = `${BASE_URL}/${code}`;

  return NextResponse.json({ shortUrl });
}