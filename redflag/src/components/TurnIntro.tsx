import { useEffect, useState } from 'react';
import { Hand, XCircle } from 'lucide-react';
import type { Player } from '../types';
import { STAGES } from '../config';
import ProgressBar from './ProgressBar';

interface TurnIntroProps {
  player: Player;
  onReady: () => void;
  onEndGame: () => void;
}

export default function TurnIntro({ player, onReady, onEndGame }: TurnIntroProps) {
  const [visible, setVisible] = useState(false);
  const stage = STAGES[player.currentStageIndex];

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100svh',
        padding: '24px 20px',
        background: '#F0F0F0',
      }}
    >
      {/* Progress bar at top */}
      <div style={{ width: '100%', paddingTop: 8 }}>
        <ProgressBar currentStageIndex={player.currentStageIndex} />
      </div>

      {/* Main content - centered vertically */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
        }}
      >
        {/* Player icon */}
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: 26,
            background: '#FECACA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(139,92,246,0.25)',
            animation: 'bounce 2s ease-in-out infinite',
          }}
        >
          <Hand size={40} color="#1A1A2E" />
        </div>

        {/* Turn text */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: '#9CA3AF', margin: '0 0 6px' }}>
            Passa il telefono a...
          </p>
          <h1
            style={{
              fontSize: 40,
              fontFamily: "'Fredoka', sans-serif",
              fontWeight: 600,
              color: '#1A1A2E',
              margin: '0 0 10px',
              lineHeight: 1.1,
            }}
          >
            {player.name}
          </h1>
          {stage && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 16px',
                borderRadius: 99,
                background: '#FCA5A5',
              }}
            >
              <span style={{ fontSize: 16 }}>{stage.emoji}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E' }}>
                {stage.label}
              </span>
            </div>
          )}
        </div>

        {/* Ready button */}
        <button
          onClick={onReady}
          style={{
            marginTop: 8,
            padding: '16px 48px',
            background: 'linear-gradient(135deg, #EF4444, #F87171)',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: 17,
            fontFamily: 'inherit',
            borderRadius: 20,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(239,68,68,0.3)',
          }}
        >
          Sono pronto!
        </button>
      </div>

      {/* End game */}
      <div style={{ paddingBottom: 8 }}>
        <button
          onClick={onEndGame}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 20px',
            fontSize: 13,
            color: '#9CA3AF',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <XCircle size={15} />
          Termina partita
        </button>
      </div>
    </div>
  );
}
