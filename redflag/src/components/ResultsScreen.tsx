import { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Heart, HeartCrack, Flag, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import type { PlayerStatistics } from '../types';
import { STAGES } from '../config';
import { playResults } from '../utils/sounds';

interface ResultsScreenProps {
  statistics: PlayerStatistics[];
  onRestart: () => void;
}

export default function ResultsScreen({ statistics, onRestart }: ResultsScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const confettiFired = useRef(false);
  const stat = statistics[currentIndex];

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  useEffect(() => {
    if (!confettiFired.current) {
      confettiFired.current = true;
      playResults();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#C4B5FD', '#DDD6FE', '#4ADE80', '#F87171'] });
      setTimeout(() => {
        confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#C4B5FD', '#DDD6FE'] });
        confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#C4B5FD', '#DDD6FE'] });
      }, 300);
    }
  }, []);

  useEffect(() => {
    setVisible(false);
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, [currentIndex]);

  const prev = () => setCurrentIndex((i) => (i > 0 ? i - 1 : statistics.length - 1));
  const next = () => setCurrentIndex((i) => (i < statistics.length - 1 ? i + 1 : 0));

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100svh',
        padding: '24px 16px',
        background: '#F0F0F0',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 24,
          animation: 'fadeInUp 0.5s ease-out',
        }}
      >
        <div style={{ width: 36, height: 36, borderRadius: 12, background: '#DDD6FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Trophy size={20} color="#1A1A2E" />
        </div>
        <h1 style={{ fontSize: 26, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, color: '#1A1A2E', margin: 0 }}>Risultati</h1>
      </div>

      {/* Player navigation */}
      {statistics.length > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <button
            onClick={prev}
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: '#FFFFFF',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#6B7280',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <div style={{ display: 'flex', gap: 6 }}>
            {statistics.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  border: 'none',
                  cursor: 'pointer',
                  background: i === currentIndex ? '#A78BFA' : 'rgba(0,0,0,0.15)',
                  transform: i === currentIndex ? 'scale(1.25)' : 'scale(1)',
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>
          <button
            onClick={next}
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: '#FFFFFF',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#6B7280',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Player card */}
      <div
        style={{
          width: '100%',
          maxWidth: 380,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
        }}
      >
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 28,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          }}
        >
          {/* Player header */}
          <div
            style={{
              background: '#C4B5FD',
              padding: '24px 24px',
              textAlign: 'center',
            }}
          >
            <h2 style={{ fontSize: 32, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, color: '#1A1A2E', margin: '0 0 4px' }}>{stat.player.name}</h2>
            <p style={{ fontSize: 14, color: '#1A1A2E', opacity: 0.7, margin: 0 }}>{stat.luckLevel}</p>
            {stat.finalPartnerName && (
              <p style={{ fontSize: 12, color: '#1A1A2E', opacity: 0.5, marginTop: 4 }}>
                Ultimo partner: {stat.finalPartnerName}
              </p>
            )}
          </div>

          {/* Stats grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 1,
              margin: '16px 16px',
              borderRadius: 20,
              overflow: 'hidden',
              background: 'rgba(0,0,0,0.03)',
            }}
          >
            <StatCell
              icon={<Heart size={16} color="#4ADE80" fill="#4ADE80" />}
              value={stat.acceptedCount}
              label="Accettate"
            />
            <StatCell
              icon={<HeartCrack size={16} color="#F87171" />}
              value={stat.rejectedCount}
              label="Rifiutate"
            />
            <StatCell
              icon={<Flag size={16} color="#8B5CF6" />}
              value={`${stat.acceptRate}%`}
              label="Acc. rate"
            />
          </div>

          {/* Badges */}
          {stat.badges.length > 0 && (
            <div style={{ padding: '0 20px 16px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                Badge
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {stat.badges.map((badge, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      background: i % 2 === 0 ? 'rgba(196,181,253,0.1)' : 'rgba(221,214,254,0.15)',
                      borderRadius: 16,
                      padding: '12px 16px',
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{badge.icon}</span>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#1A1A2E', margin: 0 }}>{badge.title}</p>
                      <p style={{ fontSize: 11, color: '#6B7280', margin: 0 }}>{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Accepted red flags */}
          {stat.player.acceptedFlags.length > 0 && (
            <div style={{ padding: '0 20px 20px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                Red Flag accettate
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {stat.player.acceptedFlags.map((flag, i) => {
                  const stage = STAGES[i];
                  const text = stat.player.partnerGender === 'female'
                    ? flag.femaleText
                    : flag.maleText;
                  return (
                    <div
                      key={`${flag.id}-${i}`}
                      style={{
                        background: '#F9FAFB',
                        borderRadius: 16,
                        padding: '12px 16px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        {stage && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              color: '#7C3AED',
                              background: 'rgba(196,181,253,0.2)',
                              padding: '2px 8px',
                              borderRadius: 99,
                            }}
                          >
                            {stage.emoji} {stage.label}
                          </span>
                        )}
                        <span style={{ marginLeft: 'auto', fontSize: 10, color: '#9CA3AF', fontWeight: 500 }}>
                          🚩 {flag.category}
                        </span>
                      </div>
                      <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.5, margin: 0 }}>{text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Restart button */}
      <button
        onClick={onRestart}
        style={{
          marginTop: 32,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '14px 32px',
          background: '#1A1A2E',
          color: '#DDD6FE',
          fontWeight: 700,
          fontSize: 15,
          fontFamily: 'inherit',
          borderRadius: 20,
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(26,26,46,0.2)',
        }}
      >
        <RotateCcw size={16} />
        Nuova partita
      </button>
    </div>
  );
}

function StatCell({ icon, value, label }: { icon: React.ReactNode; value: number | string; label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        padding: '16px 8px',
        background: '#FFFFFF',
      }}
    >
      {icon}
      <span style={{ fontSize: 20, fontWeight: 700, color: '#1A1A2E' }}>{value}</span>
      <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 500 }}>{label}</span>
    </div>
  );
}
