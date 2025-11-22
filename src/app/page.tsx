'use client';

import { useState, useEffect } from 'react';
import { Link2, Zap, Copy, ExternalLink } from 'lucide-react';

interface Link {
  shortUrl: string;
  original: string;
  clicks: number;
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [links, setLinks] = useState<Link[]>([]);
  const [message, setMessage] = useState('');

  // THIS IS THE MAGIC: Refresh clicks from DB every 3 seconds when page is open
  useEffect(() => {
    const refreshClicks = async () => {
      const saved = localStorage.getItem('myLinks');
      if (!saved) return;

      const savedLinks: Link[] = JSON.parse(saved);

      try {
        const res = await fetch('/api/links');
        if (!res.ok) throw new Error('Failed');
        const dbLinks = await res.json();

        const updated = savedLinks.map((link) => {
          const code = link.shortUrl.split('/').pop();
          const db = dbLinks.find((d: any) => d.code === code);
          return { ...link, clicks: db?.clicks || link.clicks };
        });

        setLinks(updated);
        localStorage.setItem('myLinks', JSON.stringify(updated));
      } catch (err) {
        console.log('Clicks refresh failed (normal during dev)');
      }
    };

    refreshClicks();
    const interval = setInterval(refreshClicks, 3000); // Refresh every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const shorten = async () => {
    if (!url || !url.startsWith('http')) {
      setMessage('Invalid URL');
      return;
    }

    const res = await fetch('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();

    if (data.shortUrl) {
      const newLink: Link = { shortUrl: data.shortUrl, original: url, clicks: 0 };
      const updated = [newLink, ...links];
      setLinks(updated);
      localStorage.setItem('myLinks', JSON.stringify(updated));
      setUrl('');
      setMessage('Shortened!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-16 pt-10">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Zap className="w-12 h-12 text-white" />
            <h1 className="text-6xl font-bold text-white">SnapLink</h1>
          </div>
          <p className="text-xl text-white/90">Free • Instant • No signup</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl mx-auto">
          <div className="flex gap-4 max-sm:flex-col">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && shorten()}
              placeholder="Paste your long URL here..."
              className="flex-1 px-6 py-5 text-lg border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-200 transition placeholder-gray-500 text-gray-900 font-medium"
            />
            <button
              onClick={shorten}
              className="px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl hover:scale-105 transition shadow-lg flex items-center gap-2"
            >
              <Link2 className="w-6 h-6" />
              Shorten URL
            </button>
          </div>
          {message && <p className="text-center mt-4 text-green-600 font-bold">{message}</p>}
        </div>

        <div className="mt-16">
          <h2 className="text-4xl font-bold text-white text-center mb-8">Your Links</h2>
          {links.length === 0 ? (
            <p className="text-center text-white/80 text-lg">No links yet — shorten one above!</p>
          ) : (
            <div className="space-y-6">
              {links.map((link, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <p className="text-white/70 text-sm mb-2">Original</p>
                  <p className="text-white/90 mb-4 truncate text-sm">{link.original}</p>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <a href={link.shortUrl} target="_blank" rel="noopener" className="text-2xl font-bold text-white hover:underline flex items-center gap-2">
                      {link.shortUrl} <ExternalLink className="w-5 h-5" />
                    </a>
                    <div className="flex items-center gap-4">
                      <span className="bg-white/20 px-6 py-3 rounded-full text-white font-bold text-xl">
                        {link.clicks} clicks
                      </span>
                      <button onClick={() => copy(link.shortUrl)} className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-full text-white font-bold flex items-center gap-2">
                        <Copy className="w-5 h-5" /> Copy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <footer className="text-center text-white/60 mt-20 text-sm">
          SnapLink • Built with Next.js + Neon • 2025
        </footer>
      </div>
    </div>
  );
}