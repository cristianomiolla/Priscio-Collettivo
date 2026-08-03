import { useEffect, useState, useRef, useCallback } from 'react';

interface RouletteWheelProps {
  availableNumbers: number[];
  selectedNumber: number;
  onComplete: () => void;
  isSamePartner: boolean;
}

const SPIN_DURATION_MS = 4000;
const SETTLE_DELAY_MS = 1200;
const CELL_WIDTH = 72;
const CELL_GAP = 4; // 2px margin each side
const CELL_TOTAL = CELL_WIDTH + CELL_GAP;
const TOTAL_SLOTS = 80;
const LANDING_INDEX = TOTAL_SLOTS - 3;

function buildSequence(pool: number[], selectedNumber: number): number[] {
  const seq: number[] = [];
  for (let i = 0; i < TOTAL_SLOTS; i++) {
    seq.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  // Force the selected number at the landing position
  seq[LANDING_INDEX] = selectedNumber;
  return seq;
}

export default function RouletteWheel({
  availableNumbers,
  selectedNumber,
  onComplete,
  isSamePartner,
}: RouletteWheelProps) {
  const [phase, setPhase] = useState<'ready' | 'spinning' | 'landed'>('ready');
  const stripRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);
  const sequenceRef = useRef<number[] | null>(null);

  // Build sequence once
  if (sequenceRef.current === null) {
    const pool = availableNumbers.length > 0 ? availableNumbers : [selectedNumber];
    sequenceRef.current = buildSequence(pool, selectedNumber);
  }

  const sequence = sequenceRef.current;
  // The number that the wheel visually stops on
  const landedNumber = sequence[LANDING_INDEX];

  const startSpin = useCallback(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    setPhase('spinning');

    const strip = stripRef.current;
    const container = containerRef.current;
    if (!strip || !container) return;

    // Center of the visible container
    const containerCenter = container.offsetWidth / 2;
    // We want the center of the landing cell to align with the container center
    const targetOffset = LANDING_INDEX * CELL_TOTAL + CELL_TOTAL / 2 - containerCenter;

    strip.style.transition = `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.15, 0.85, 0.35, 1)`;
    strip.style.transform = `translateX(-${targetOffset}px)`;

    setTimeout(() => {
      setPhase('landed');
      setTimeout(onComplete, SETTLE_DELAY_MS);
    }, SPIN_DURATION_MS);
  }, [onComplete]);

  useEffect(() => {
    const timer = setTimeout(startSpin, 600);
    return () => clearTimeout(timer);
  }, [startSpin]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100svh',
        padding: '24px 20px',
        background: '#F0F0F0',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Title */}
      <p
        style={{
          fontSize: 22,
          fontFamily: "'Fredoka', sans-serif",
          fontWeight: 600,
          color: '#1A1A2E',
          textAlign: 'center',
          marginBottom: 32,
          animation: 'fadeInUp 0.5s ease-out',
        }}
      >
        {isSamePartner ? 'Gira la ruota del destino...' : 'Vediamo cosa ti riserva la sorte!'}
      </p>

      {/* Wheel container */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 400,
          height: 90,
          overflow: 'hidden',
          borderRadius: 16,
          background: '#1A1A2E',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18), inset 0 2px 8px rgba(0,0,0,0.3)',
        }}
      >
        {/* Center pointer top */}
        <div
          style={{
            position: 'absolute',
            top: -6,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: '14px solid #F87171',
            zIndex: 10,
            filter: 'drop-shadow(0 2px 4px rgba(248,113,113,0.5))',
          }}
        />
        {/* Center pointer bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: -6,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderBottom: '14px solid #F87171',
            zIndex: 10,
            filter: 'drop-shadow(0 -2px 4px rgba(248,113,113,0.5))',
          }}
        />

        {/* Gradient overlays */}
        <div
          style={{
            position: 'absolute', top: 0, left: 0, width: 60, height: '100%',
            background: 'linear-gradient(to right, #1A1A2E, transparent)',
            zIndex: 5, pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute', top: 0, right: 0, width: 60, height: '100%',
            background: 'linear-gradient(to left, #1A1A2E, transparent)',
            zIndex: 5, pointerEvents: 'none',
          }}
        />

        {/* Scrolling strip */}
        <div
          ref={stripRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            willChange: 'transform',
          }}
        >
          {sequence.map((num, i) => {
            const isLanded = phase === 'landed' && i === LANDING_INDEX;
            return (
              <div
                key={i}
                style={{
                  flex: `0 0 ${CELL_WIDTH}px`,
                  height: 70,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: `0 ${CELL_GAP / 2}px`,
                  borderRadius: 12,
                  background: isLanded
                    ? 'linear-gradient(135deg, #F87171, #EF4444)'
                    : 'linear-gradient(135deg, #2D2D4E, #3D3D6E)',
                  border: isLanded
                    ? '2px solid #FCA5A5'
                    : '1px solid rgba(255,255,255,0.08)',
                  transition: 'background 0.3s, border 0.3s, transform 0.3s',
                  transform: isLanded ? 'scale(1.08)' : 'scale(1)',
                  boxShadow: isLanded
                    ? '0 0 20px rgba(248,113,113,0.6)'
                    : 'none',
                }}
              >
                <span
                  style={{
                    fontSize: isLanded ? 28 : 22,
                    fontWeight: 700,
                    fontFamily: "'Fredoka', sans-serif",
                    color: isLanded ? '#FFF' : 'rgba(255,255,255,0.6)',
                    transition: 'font-size 0.3s, color 0.3s',
                  }}
                >
                  {num}
                </span>
              </div>
            );
          })}
        </div>
      </div>


      {/* Waiting dots */}
      {phase !== 'landed' && (
        <div style={{ display: 'flex', gap: 8, marginTop: 28 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#F87171',
                animation: 'loadingDot 1.2s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
