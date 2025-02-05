"use client"

import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaHeart, FaArrowRight } from 'react-icons/fa';
import confetti from 'canvas-confetti';
import './styles.css'; // Create this file for custom CSS

export default function Home() {
  const [hearts, setHearts] = useState<Array<{ id: number; top: number; left: number }>>([]);

  // Generate floating hearts
  useEffect(() => {
    const newHearts = Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
    }));
    setHearts(newHearts);
  }, []);

  // Confetti effect
  const handleConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-valentine-pink to-valentine-light-pink flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <Head>
        <title>Crushu 💘 - Ask Your Crush Out!</title>
        <meta name="description" content="Crushu: The playful way to ask your crush out. No escape from saying yes!" />
      </Head>

      {/* Floating Hearts Animation */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="heart-floating"
          style={{
            top: `${heart.top}%`,
            left: `${heart.left}%`,
          }}
        >
          ❤️
        </div>
      ))}

      <main className="text-center z-10">
        <h1 className="text-6xl font-dancing text-valentine-white animate-heartbeat">
          Welcome to <span className="text-valentine-red">Crushu</span>! <FaHeart className="inline-block" />
        </h1>
        <p className="mt-4 text-2xl font-roboto text-valentine-white">
          The playful way to ask your crush out. <br />
          <strong>No escape from saying yes!</strong>
        </p>

        <div className="mt-8">
          <Link href="/ask" passHref>
            <div
              className="bg-valentine-white p-6 rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform"
              onClick={handleConfetti}
            >
              <h2 className="text-2xl font-dancing text-valentine-pink flex items-center justify-center">
                Ask Your Crush <FaArrowRight className="ml-2" />
              </h2>
              <p className="mt-2 text-valentine-red font-roboto">
                Start the fun and see what happens!
              </p>
            </div>
          </Link>
        </div>
      </main>

      <footer className="mt-8 text-valentine-white font-roboto z-10">
        <p>Made with ❤️ by Crushu Team</p>
      </footer>
    </div>
  );
}