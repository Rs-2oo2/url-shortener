import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function RedirectPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  let link;
  try {
    link = await prisma.link.findUnique({
      where: { code },
    });
  } catch (error) {
    console.error('DB query error:', error);
    notFound();
  }

  if (!link) {
    notFound();  // Shows Vercel's 404, but you can customize
  }

  // Track click
  fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/click`, {
    method: 'POST',
    body: JSON.stringify({ code }),
    headers: { 'Content-Type': 'application/json' },
  }).catch(() => {});

  return <meta httpEquiv="refresh" content={`0;url=${link.url}`} />;
}