import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'SnapLink – Free URL Shortener',
    template: '%s | SnapLink',
  },
  description: 'Instant URL shortening • Real-time analytics • No signup required',
  icons: {
    icon: '/public/89c9ee73-1096-4a93-9277-409d75cd10fd.png',
    apple: '/public/89c9ee73-1096-4a93-9277-409d75cd10fd.png',
  },
  openGraph: {
    title: 'SnapLink',
    description: 'Free & fast URL shortener with click tracking',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}