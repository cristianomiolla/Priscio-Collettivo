import { useState, useRef, useCallback, useMemo } from 'react';

interface RouletteWheelProps {
  availableNumbers: number[];
  selectedNumber: number;
  onComplete: () => void;
  isSamePartner: boolean;
}

const CELL_WIDTH_DESKTOP = 64;
const CELL_WIDTH_MOBILE = 48;
const CELL_GAP = 4;

// Pull config
const MAX_PULL = 120;
const MIN_PULL = 8;
const MIN_SLOTS = 18;      // weak pull: few numbers scroll by
const MAX_SLOTS = 80;      // strong pull: many numbers
const MIN_DURATION = 2500;  // weak pull: slow and short
const MAX_DURATION = 5500;  // strong pull: fast and long
const SETTLE_DELAY_MS = 1200;

// Spring geometry
const SPRING_REST_WIDTH = 140;
const SPRING_COILS = 8;
const BALL_SIZE = 44;

function buildSequence(pool: number[], selectedNumber: number, totalSlots: number): number[] {
  const seq: number[] = [];
  for (let i = 0; i < totalSlots; i++) {
    seq.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  // Place the selected number with enough padding after it to fill the visible area
  const landingIndex = totalSlots - 8;
  seq[landingIndex] = selectedNumber;
  return seq;
}

export default function RouletteWheel({
  availableNumbers,
  selectedNumber,
  onComplete,
  isSamePartner,
}: RouletteWheelProps) {
  const isMobile = useMemo(() => window.innerWidth < 480, []);
  const CELL_WIDTH = isMobile ? CELL_WIDTH_MOBILE : CELL_WIDTH_DESKTOP;
  const CELL_TOTAL = CELL_WIDTH + CELL_GAP;
  const CELL_HEIGHT = isMobile ? 46 : 70;
  const CELL_FONT = isMobile ? 16 : 22;
  const CELL_FONT_LANDED = isMobile ? 22 : 28;
  const CONTAINER_HEIGHT = isMobile ? 62 : 90;

  const [phase, setPhase] = useState<'waiting' | 'pulling' | 'spinning' | 'landed'>('waiting');
  const [pullAmount, setPullAmount] = useState(0);
  const [sequence, setSequence] = useState<number[]>(() => {
    // Initial short sequence just for the idle display
    const pool = availableNumbers.length > 0 ? availableNumbers : [selectedNumber];
    return buildSequence(pool, selectedNumber, MIN_SLOTS);
  });
  const [landingIndex, setLandingIndex] = useState(MIN_SLOTS - 8);
  const stripRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const vibrationFrameRef = useRef<number>(0);

  const startX = useRef(0);
  const pulling = useRef(false);
  const pullRef = useRef(0);

  const canVibrate = useMemo(() => typeof navigator !== 'undefined' && 'vibrate' in navigator, []);

  const spin = useCallback((power: number) => {
    const strip = stripRef.current;
    const container = containerRef.current;
    if (!strip || !container) return;

    // More power = more slots AND longer duration
    const totalSlots = Math.round(MIN_SLOTS + power * (MAX_SLOTS - MIN_SLOTS));
    const newLandingIndex = totalSlots - 8;
    const duration = MIN_DURATION + power * (MAX_DURATION - MIN_DURATION);

    // Build a new sequence with the right length
    const pool = availableNumbers.length > 0 ? availableNumbers : [selectedNumber];
    const newSeq = buildSequence(pool, selectedNumber, totalSlots);
    setSequence(newSeq);
    setLandingIndex(newLandingIndex);

    // Need a frame for React to render the new sequence before animating
    requestAnimationFrame(() => {
      const s = stripRef.current;
      const c = containerRef.current;
      if (!s || !c) return;

      // Reset position instantly before animating
      s.style.transition = 'none';
      s.style.transform = 'translateX(0)';
      // Force reflow
      void s.offsetWidth;

      setPhase('spinning');

      const containerCenter = c.offsetWidth / 2;
      const targetOffset = newLandingIndex * CELL_TOTAL + CELL_TOTAL / 2 - containerCenter;

      // Weak pull: gentle ease-out. Strong pull: fast start, long deceleration
      const easingX1 = 0.1 + power * 0.15;   // 0.10 → 0.25
      const easingY1 = 0.4 + power * 0.5;    // 0.40 → 0.90
      s.style.transition = `transform ${duration}ms cubic-bezier(${easingX1}, ${easingY1}, 0.25, 1)`;
      s.style.transform = `translateX(-${targetOffset}px)`;

      // Haptic feedback: vibrate briefly each time a new cell passes the center
      if (canVibrate) {
        let lastCellIndex = -1;
        const tick = () => {
          const currentStrip = stripRef.current;
          const currentContainer = containerRef.current;
          if (!currentStrip || !currentContainer) return;
          const transform = getComputedStyle(currentStrip).transform;
          // Extract translateX from matrix(a, b, c, d, tx, ty)
          const match = transform.match(/matrix\(.+,\s*(.+)\)/);
          if (match) {
            const tx = Math.abs(parseFloat(match[1]));
            const containerCenter = currentContainer.offsetWidth / 2;
            const centerPos = tx + containerCenter;
            const cellIndex = Math.floor(centerPos / CELL_TOTAL);
            if (cellIndex !== lastCellIndex) {
              lastCellIndex = cellIndex;
              navigator.vibrate(8);
            }
          }
          vibrationFrameRef.current = requestAnimationFrame(tick);
        };
        vibrationFrameRef.current = requestAnimationFrame(tick);
      }

      setTimeout(() => {
        setPhase('landed');
        // Stop vibration loop
        if (vibrationFrameRef.current) {
          cancelAnimationFrame(vibrationFrameRef.current);
        }
        // One slightly longer vibration for the landing
        if (canVibrate) navigator.vibrate(15);
        setTimeout(onComplete, SETTLE_DELAY_MS);
      }, duration);
    });
  }, [onComplete, availableNumbers, selectedNumber, canVibrate, CELL_TOTAL]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (phase !== 'waiting') return;
    pulling.current = true;
    startX.current = e.clientX;
    setPhase('pulling');
    setPullAmount(0);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, [phase]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!pulling.current) return;
    const dx = Math.max(0, startX.current - e.clientX);
    const normalized = Math.min(dx / MAX_PULL, 1);
    pullRef.current = normalized;
    setPullAmount(normalized);
  }, []);

  const onPointerUp = useCallback(() => {
    if (!pulling.current) return;
    pulling.current = false;
    const currentPull = pullRef.current;
    pullRef.current = 0;
    setPullAmount(0);

    if (currentPull * MAX_PULL >= MIN_PULL) {
      spin(currentPull);
    } else {
      setPhase('waiting');
    }
  }, [spin]);

  const powerPercent = Math.round(pullAmount * 100);
  const compression = pullAmount * MAX_PULL;

  const barColor = pullAmount < 0.33
    ? '#4ADE80'
    : pullAmount < 0.66
      ? '#FBBF24'
      : '#F87171';

  // Spring path: compressed zigzag
  const springWidth = SPRING_REST_WIDTH - compression;
  const coilWidth = springWidth / SPRING_COILS;
  const springAmplitude = 8;

  let springPath = `M 0 0`;
  for (let i = 0; i < SPRING_COILS; i++) {
    const x1 = i * coilWidth + coilWidth * 0.25;
    const x2 = i * coilWidth + coilWidth * 0.75;
    const x3 = (i + 1) * coilWidth;
    springPath += ` L ${x1} ${-springAmplitude} L ${x2} ${springAmplitude} L ${x3} 0`;
  }

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
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'none',
      }}
    >
      <style>{`
        @keyframes nudgeLeft {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-8px); }
        }
      `}</style>

      {/* Title — fixed height to prevent layout shift */}
      <p
        style={{
          fontSize: 22,
          fontFamily: "'Fredoka', sans-serif",
          fontWeight: 600,
          color: '#1A1A2E',
          textAlign: 'center',
          marginBottom: 28,
          minHeight: 30,
          animation: 'fadeInUp 0.5s ease-out',
        }}
      >
        {phase === 'waiting' && (isSamePartner ? 'Comprimi e rilascia!' : 'Carica la molla e rilascia!')}
        {phase === 'pulling' && `Potenza: ${powerPercent}%`}
        {phase === 'spinning' && 'La ruota gira...'}
        {phase === 'landed' && 'Ecco il tuo destino!'}
      </p>

      {/* Wheel container */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: isMobile ? 400 : 600,
          height: CONTAINER_HEIGHT,
          overflow: 'hidden',
          borderRadius: 16,
          background: '#1A1A2E',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18), inset 0 2px 8px rgba(0,0,0,0.3)',
        }}
      >
        {/* Center pointer top */}
        <div
          style={{
            position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '10px solid transparent', borderRight: '10px solid transparent',
            borderTop: '14px solid #F87171',
            zIndex: 10, filter: 'drop-shadow(0 2px 4px rgba(248,113,113,0.5))',
          }}
        />
        {/* Center pointer bottom */}
        <div
          style={{
            position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '10px solid transparent', borderRight: '10px solid transparent',
            borderBottom: '14px solid #F87171',
            zIndex: 10, filter: 'drop-shadow(0 -2px 4px rgba(248,113,113,0.5))',
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
            const isLanded = phase === 'landed' && i === landingIndex;
            return (
              <div
                key={i}
                style={{
                  flex: `0 0 ${CELL_WIDTH}px`,
                  height: CELL_HEIGHT,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: `0 ${CELL_GAP / 2}px`,
                  borderRadius: isMobile ? 8 : 12,
                  background: isLanded
                    ? 'linear-gradient(135deg, #F87171, #EF4444)'
                    : 'linear-gradient(135deg, #2D2D4E, #3D3D6E)',
                  border: isLanded
                    ? '2px solid #FCA5A5'
                    : '1px solid rgba(255,255,255,0.08)',
                  transition: 'background 0.3s, border 0.3s, transform 0.3s',
                  transform: isLanded ? 'scale(1.08)' : 'scale(1)',
                  boxShadow: isLanded ? '0 0 20px rgba(248,113,113,0.6)' : 'none',
                }}
              >
                <span
                  style={{
                    fontSize: isLanded ? CELL_FONT_LANDED : CELL_FONT,
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

      {/* Bottom area — fixed height to prevent layout shift */}
      <div style={{ height: 93, marginTop: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>

      {/* Spring + ball area */}
      {(phase === 'waiting' || phase === 'pulling') && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          {/* Spring mechanism */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: 60,
            }}
          >
            {/* Wall / stopper */}
            <div
              style={{
                width: 6,
                height: 48,
                borderRadius: 3,
                background: '#1A1A2E',
                flexShrink: 0,
              }}
            />

            {/* Spring SVG */}
            <svg
              width={springWidth + 4}
              height={springAmplitude * 2 + 4}
              viewBox={`-2 ${-springAmplitude - 2} ${springWidth + 4} ${springAmplitude * 2 + 4}`}
              style={{
                flexShrink: 0,
                transition: phase === 'pulling' ? 'none' : 'width 0.3s ease-out',
                overflow: 'visible',
              }}
            >
              <path
                d={springPath}
                stroke={barColor}
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Draggable ball */}
            <div
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              style={{
                width: BALL_SIZE,
                height: BALL_SIZE,
                borderRadius: '50%',
                background: phase === 'pulling'
                  ? `radial-gradient(circle at 35% 35%, ${barColor}, ${barColor}BB)`
                  : 'radial-gradient(circle at 35% 35%, #F87171, #DC2626)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'grab',
                boxShadow: phase === 'pulling'
                  ? `0 3px 16px ${barColor}55, inset 0 -2px 4px rgba(0,0,0,0.15)`
                  : '0 3px 16px rgba(248,113,113,0.35), inset 0 -2px 4px rgba(0,0,0,0.15)',
                flexShrink: 0,
                touchAction: 'none',
                animation: phase === 'waiting' ? 'nudgeLeft 2s ease-in-out infinite' : 'none',
                transition: phase === 'pulling' ? 'background 0.1s' : 'all 0.3s ease-out',
                position: 'relative',
              }}
            >
              {/* Arrow inside */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
              {/* Shine */}
              <div
                style={{
                  position: 'absolute',
                  top: 6,
                  left: 8,
                  width: 10,
                  height: 6,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.3)',
                }}
              />
            </div>
          </div>

          {/* Power bar */}
          {phase === 'pulling' && (
            <div
              style={{
                width: 140,
                height: 6,
                borderRadius: 3,
                background: '#E5E7EB',
                marginTop: 12,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${powerPercent}%`,
                  height: '100%',
                  borderRadius: 3,
                  background: barColor,
                  transition: 'width 0.05s linear, background 0.15s',
                }}
              />
            </div>
          )}

          {phase === 'waiting' && (
            <p
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: '#9CA3AF',
                margin: '10px 0 0',
                fontFamily: "'Fredoka', sans-serif",
              }}
            >
              Trascina la pallina verso sinistra
            </p>
          )}
        </div>
      )}

      {/* Spinning dots */}
      {phase === 'spinning' && (
        <div style={{ display: 'flex', gap: 8 }}>
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

      </div>{/* end fixed-height bottom area */}
    </div>
  );
}
