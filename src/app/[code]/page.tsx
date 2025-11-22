import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function RedirectPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;   // ← THIS LINE IS THE FIX

  const link = await prisma.link.findUnique({
    where: { code },
  });

  if (!link) {
    notFound();
  }

  // Track click (fire and forget)
  fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/click`, {
    method: 'POST',
    body: JSON.stringify({ code }),
    headers: { 'Content-Type': 'application/json' },
  }).catch(() => {});

  return <meta httpEquiv="refresh" content={`0;url=${link.url}`} />;
}