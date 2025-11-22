import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
  const { url } = await req.json();

  if (!url || !url.startsWith('http')) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  const code = nanoid(7);

  await prisma.link.create({
    data: { code, url },
  });

  // THIS LINE IS THE KEY — uses Vercel URL or localhost fallback
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const shortUrl = `${baseUrl}/${code}`;

  return NextResponse.json({ shortUrl });
}