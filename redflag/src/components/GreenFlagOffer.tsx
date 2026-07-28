import { useState, useEffect } from 'react';
import { Heart, HeartCrack, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { GreenFlagOffer as GreenFlagOfferType, Player } from '../types';
import { playGreenFlag } from '../utils/sounds';

interface GreenFlagOfferProps {
  offer: GreenFlagOfferType;
  player: Player;
  onAccept: () => void;
  onReject: () => void;
}

function triggerGreenConfetti() {
  confetti({
    particleCount: 60,
    spread: 80,
    origin: { y: 0.5 },
    colors: ['#4ADE80', '#34D399', '#6EE7B7', '#A7F3D0'],
    disableForReducedMotion: true,
  });
}

export default function GreenFlagOffer({ offer, player, onAccept, onReject }: GreenFlagOfferProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = requestAnimationFrame(() => setVisible(true));
    triggerGreenConfetti();
    playGreenFlag();
    return () => cancelAnimationFrame(timer);
  }, []);

  const { greenFlag, originalTurn } = offer;
  const flagText = originalTurn.partner.gender === 'male'
    ? greenFlag.maleText
    : greenFlag.femaleText;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100svh',
        padding: '24px 16px',
        background: '#F0F0F0',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 380,
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
          transition: 'all 0.5s ease-out',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <p style={{ fontSize: 14, color: '#9CA3AF', margin: 0 }}>{player.name}</p>
        </div>

        {/* Card */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 28,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(74,222,128,0.15)',
            border: '2px solid #4ADE80',
          }}
        >
          {/* Partner header - green themed */}
          <div
            style={{
              background: '#4ADE80',
              padding: '28px 24px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                margin: '0 auto 10px',
                borderRadius: 22,
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              }}
            >
              {originalTurn.partner.gender === 'male' ? '\u{1F468}' : '\u{1F469}'}
            </div>
            <h2 style={{ fontSize: 24, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, color: '#1A1A2E', margin: 0 }}>
              {originalTurn.partner.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 6, color: '#1A1A2E', opacity: 0.6, fontSize: 14 }}>
              <MapPin size={12} />
              <span>Vicino a te</span>
            </div>
          </div>

          {/* Message */}
          <div style={{ padding: '24px 24px 8px', textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: '#6B7280', fontWeight: 600, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Ultima possibilit\u00E0!
            </p>
            <p style={{ fontSize: 17, color: '#1A1A2E', fontWeight: 500, lineHeight: 1.5, margin: 0 }}>
              {flagText}
            </p>
          </div>

          {/* Explanation */}
          <div style={{ padding: '12px 24px 24px', textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0, lineHeight: 1.5 }}>
              Accetta la green flag per salvare {originalTurn.partner.name} e continuare, oppure rifiuta e chiudi il turno.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginTop: 24 }}>
          <button
            onClick={onReject}
            style={{
              width: 56,
              height: 56,
              borderRadius: 20,
              background: '#FFFFFF',
              border: '2px solid #F87171',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#F87171',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            }}
          >
            <HeartCrack size={24} />
          </button>
          <button
            onClick={onAccept}
            style={{
              width: 56,
              height: 56,
              borderRadius: 20,
              background: '#FFFFFF',
              border: '2px solid #4ADE80',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#4ADE80',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            }}
          >
            <Heart size={24} fill="#4ADE80" />
          </button>
        </div>

        {/* Hint */}
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0, fontWeight: 500 }}>
            \u2190 Rifiuta \u00A0\u00A0\u00A0 Accetta \u2192
          </p>
        </div>
      </div>
    </div>
  );
}
