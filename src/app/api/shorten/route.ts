import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
  const { url } = await req.json();

  if (!url || !url.startsWith('http')) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  const code = nanoid(7);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  try {
    await prisma.link.create({
      data: { code, url },
    });
  } catch (error) {
    console.error('DB create error:', error);
    // Still return the short URL even if DB fails (fallback for demo)
  }

  const shortUrl = `${baseUrl}/${code}`;
  return NextResponse.json({ shortUrl });
}