// src/app/success/page.tsx
'use client'; // Mark this as a Client Component

import { useParams } from 'next/navigation'; // Use `next/navigation` instead of `next/router`
import Head from 'next/head';
import { FaCopy } from 'react-icons/fa';

export default function Success() {
  const params = useParams();
  const id  = params.id

  // Generate the shareable link
  const shareableLink = `https://crushu-front.onrender.com/decide/${id}`;

  // Copy link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-valentine-pink to-valentine-light-pink flex flex-col items-center justify-center p-4">
      <Head>
        <title>Success! 💘 - Crushu</title>
        <meta name="description" content="Your crush has been notified. Share the link and wait for their response!" />
      </Head>

      <main className="text-center">
        <h1 className="text-4xl font-dancing text-valentine-white mb-8">
          Success! 💘
        </h1>
        <p className="text-2xl font-roboto text-valentine-white mb-4">
          Share this link with your crush:
        </p>
        <div className="flex items-center justify-center bg-valentine-white p-4 rounded-lg shadow-lg">
          <p className="text-valentine-pink font-roboto break-all">
            {shareableLink}
          </p>
          <button
            onClick={copyToClipboard}
            className="ml-4 text-valentine-red hover:text-valentine-pink transition-colors"
          >
            <FaCopy className="text-2xl" />
          </button>
        </div>
        <p className="mt-4 text-valentine-white font-roboto">
          You’ll receive an email when they respond. Good luck! 🌹
        </p>
      </main>
    </div>
  );
}