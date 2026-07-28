import { useEffect, useState } from 'react';
import { SUSPENSE_DURATION_MS, STAGES } from '../config';

const newPartnerMessages = [
  'Qualcuno ti ha matchato!',
  'Vediamo chi hai trovato...',
  'Preparati al tuo destino...',
  'Chi sara\' il tuo match?',
  'Stiamo cercando l\'anima gemella...',
  'Attenzione, arriva qualcuno...',
  'Incrocio le dita per te...',
  'Il cuore batte forte...',
];

const samePartnerMessages = [
  'Stai scoprendo un suo nuovo difetto...',
  'Ma c\'e\' dell\'altro...',
  'Aspetta, non e\' finita qui...',
  'Hai il coraggio di andare avanti?',
  'Indovina cosa nasconde ancora...',
  'Oh no, c\'e\' un\'altra sorpresa...',
  'Resisti, sta arrivando il bello...',
  'Sicuro di voler sapere il resto?',
];

const floatingHearts = ['💕', '💖', '💗', '💘', '💝', '❤️', '💔', '🩷'];

interface SuspenseScreenProps {
  onComplete: () => void;
  isSamePartner: boolean;
  currentStageIndex: number;
}

export default function SuspenseScreen({ onComplete, isSamePartner, currentStageIndex }: SuspenseScreenProps) {
  const stage = STAGES[currentStageIndex];
  const [message] = useState(() => {
    const pool = isSamePartner ? samePartnerMessages : newPartnerMessages;
    return pool[Math.floor(Math.random() * pool.length)];
  });

  useEffect(() => {
    const timer = setTimeout(onComplete, SUSPENSE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100svh',
        padding: '24px 20px',
        position: 'relative',
        overflow: 'hidden',
        background: '#F0F0F0',
      }}
    >
      {/* Floating hearts */}
      {floatingHearts.map((heart, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            fontSize: 24,
            opacity: 0,
            left: `${10 + (i * 11) % 80}%`,
            bottom: '-10%',
            animation: `floatHeart 2s ease-in-out forwards`,
            animationDelay: `${i * 0.2}s`,
          }}
        >
          {heart}
        </span>
      ))}

      {/* Pulsing heart */}
      <div style={{ position: 'relative', marginBottom: 32 }}>
        <div
          style={{
            width: 112,
            height: 112,
            borderRadius: 32,
            background: 'rgba(196,181,253,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulseRing 1.5s ease-in-out infinite',
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 24,
              background: '#C4B5FD',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulseRing 1.5s ease-in-out infinite 0.3s',
            }}
          >
            <span style={{ fontSize: 48, animation: 'heartbeat 1s ease-in-out infinite' }}>
              💘
            </span>
          </div>
        </div>
      </div>

      {/* Stage badge */}
      {isSamePartner && stage && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 16px',
            borderRadius: 99,
            background: '#DDD6FE',
            marginBottom: 16,
            animation: 'fadeInUp 0.4s ease-out',
          }}
        >
          <span style={{ fontSize: 16 }}>{stage.emoji}</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E' }}>
            {stage.label}
          </span>
        </div>
      )}

      {/* Message */}
      <p
        style={{
          fontSize: 22,
          fontFamily: "'Fredoka', sans-serif",
          fontWeight: 600,
          color: '#1A1A2E',
          textAlign: 'center',
          margin: 0,
          animation: 'fadeInUp 0.5s ease-out',
        }}
      >
        {message}
      </p>

      {/* Loading dots */}
      <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#A78BFA',
              animation: 'loadingDot 1.2s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
