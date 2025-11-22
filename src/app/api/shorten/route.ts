// src/app/api/shorten/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { nanoid } from 'nanoid';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://url-shortener-eight-tan.vercel.app';

export async function POST(req: Request) {
  const { url } = await req.json();

  if (!url || !url.startsWith('http')) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  const code = nanoid(7);

  await prisma.link.upsert({
    where: { url },
    update: { clicks: { increment: 0 } },
    create: { code, url },
  });

  const shortUrl = `${BASE_URL}/${code}`;

  return NextResponse.json({ shortUrl });
}