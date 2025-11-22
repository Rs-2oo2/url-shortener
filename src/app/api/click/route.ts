import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  if (!code) return NextResponse.json({ error: 'No code' }, { status: 400 });

  await prisma.link.update({
    where: { code },
    data: { clicks: { increment: 1 } },
    // Optional: also save timestamp
    // create a ClickEvent if you want later
  });

  return NextResponse.json({ success: true });
}