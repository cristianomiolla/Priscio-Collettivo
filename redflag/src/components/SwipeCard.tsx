import { useState, useRef, useCallback, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, HeartCrack, Flag, MapPin, XCircle, History, X } from 'lucide-react';
import type { Turn, Player } from '../types';
import { MAX_ACCEPT_PER_TURN } from '../config';
import ProgressBar from './ProgressBar';
import ConfirmModal from './ConfirmModal';
import { playSwipeAccept, playSwipeReject, playFlipReveal } from '../utils/sounds';

const illustrationModules = import.meta.glob('../assets/illustration/*.png', { eager: true, import: 'default' }) as Record<string, string>;
const illustrations: Record<number, string> = {};
for (const path in illustrationModules) {
  const match = path.match(/\/(\d+)\.png$/);
  if (match) illustrations[Number(match[1])] = illustrationModules[path];
}

interface SwipeCardProps {
  turn: Turn;
  player: Player;
  onAccept: () => void;
  onReject: () => void;
  onEndGame: () => void;
}

const SWIPE_THRESHOLD = 80;

function triggerVibration() {
  if (navigator.vibrate) {
    navigator.vibrate([50, 30, 80]);
  }
}

function triggerMiniConfetti() {
  confetti({
    particleCount: 40,
    spread: 60,
    origin: { y: 0.7 },
    colors: ['#FCA5A5', '#FECACA', '#4ADE80', '#F87171'],
    disableForReducedMotion: true,
  });
}

export default function SwipeCard({ turn, player, onAccept, onReject, onEndGame }: SwipeCardProps) {
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [exitDir, setExitDir] = useState<'left' | 'right' | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardEnter, setCardEnter] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const startX = useRef(0);
  const processing = useRef(false);
  const redFlagText = turn.partner.gender === 'male'
    ? turn.redFlag.maleText
    : turn.redFlag.femaleText;

  useEffect(() => {
    processing.current = false;
    setCardEnter(false);
    setIsFlipped(false);
    setExitDir(null);
    setOffsetX(0);

    const enterTimer = requestAnimationFrame(() => setCardEnter(true));
    const flipTimer = setTimeout(() => {
      setIsFlipped(true);
      triggerVibration();
      playFlipReveal();
    }, 500);

    return () => {
      cancelAnimationFrame(enterTimer);
      clearTimeout(flipTimer);
    };
  }, [turn.redFlag.id, turn.partner.name]);

  const handleStart = useCallback((clientX: number) => {
    if (!isFlipped) return;
    startX.current = clientX;
    setIsDragging(true);
  }, [isFlipped]);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging) return;
    setOffsetX(clientX - startX.current);
  }, [isDragging]);

  const doAccept = useCallback(() => {
    if (processing.current) return;
    processing.current = true;
    setExitDir('right');
    triggerMiniConfetti();
    playSwipeAccept();
    setTimeout(onAccept, 300);
  }, [onAccept]);

  const doReject = useCallback(() => {
    if (processing.current) return;
    processing.current = true;
    setExitDir('left');
    playSwipeReject();
    setTimeout(onReject, 300);
  }, [onReject]);

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    if (offsetX > SWIPE_THRESHOLD) {
      doAccept();
    } else if (offsetX < -SWIPE_THRESHOLD) {
      doReject();
    } else {
      setOffsetX(0);
    }
  }, [isDragging, offsetX, doAccept, doReject]);

  const rotation = exitDir
    ? exitDir === 'right' ? 20 : -20
    : offsetX * 0.1;
  const translateX = exitDir
    ? exitDir === 'right' ? 500 : -500
    : offsetX;

  const acceptOpacity = Math.max(0, Math.min(1, offsetX / SWIPE_THRESHOLD));
  const rejectOpacity = Math.max(0, Math.min(1, -offsetX / SWIPE_THRESHOLD));

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100svh',
        padding: '24px 16px',
        background: '#F0F0F0',
        overflow: 'hidden',
      }}
    >
      {/* Progress bar */}
      <div style={{ width: '100%', marginBottom: 16, paddingTop: 8, flexShrink: 0 }}>
        <ProgressBar currentStageIndex={player.currentStageIndex} />
      </div>

      {/* Player name & stage */}
      <div style={{ position: 'relative', textAlign: 'center', marginBottom: 16, width: '100%', maxWidth: 380, flexShrink: 0 }}>
        <p style={{ fontSize: 14, color: '#9CA3AF', margin: 0 }}>{player.name}</p>
      </div>

      {/* Card */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: 380,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxHeight: '100%',
            userSelect: 'none',
            touchAction: 'none',
            opacity: cardEnter ? 1 : 0,
            transform: `translateX(${translateX}px) rotate(${rotation}deg) scale(${cardEnter ? 1 : 0.9})`,
            transition: isDragging
              ? 'none'
              : 'transform 0.5s ease-out, opacity 0.5s ease-out',
          }}
          onMouseDown={(e) => handleStart(e.clientX)}
          onMouseMove={(e) => handleMove(e.clientX)}
          onMouseUp={handleEnd}
          onMouseLeave={() => { if (isDragging) handleEnd(); }}
          onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX)}
          onTouchEnd={handleEnd}
        >
          {/* Flip card container */}
          <div className="flip-container">
            <div className={`flip-card ${isFlipped ? 'flipped' : ''}`}>
              {/* FRONT */}
              <div className="flip-front">
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 28,
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  }}
                >
                  {illustrations[turn.redFlag.id] ? (
                    <div className="card-header" style={{ background: '#FCA5A5', padding: '20px 24px', textAlign: 'center' }}>
                      <h2 style={{ fontSize: 24, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, color: '#1A1A2E', margin: '0 0 4px' }}>
                        {turn.partner.name}
                      </h2>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, color: '#1A1A2E', opacity: 0.6, fontSize: 13, marginBottom: 14 }}>
                        <MapPin size={12} />
                        <span>Vicino a te</span>
                      </div>
                      <div className="card-illustration" style={{
                        display: 'inline-block',
                        padding: 8,
                        borderRadius: 16,
                        background: '#FFFFFF',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                      }}>
                        <img
                          src={illustrations[turn.redFlag.id]}
                          alt=""
                          style={{
                            display: 'block',
                            width: '100%',
                            maxWidth: 340,
                            aspectRatio: '340 / 180',
                            borderRadius: 10,
                            objectFit: 'cover',
                            background: '#FFFFFF',
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="card-header" style={{ background: '#FCA5A5', padding: '32px 24px', textAlign: 'center' }}>
                      <div
                        className="card-avatar"
                        style={{
                          width: 80,
                          height: 80,
                          margin: '0 auto 12px',
                          borderRadius: 24,
                          background: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 36,
                          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                        }}
                      >
                        {turn.partner.gender === 'male' ? '👨' : '👩'}
                      </div>
                      <h2 style={{ fontSize: 26, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, color: '#1A1A2E', margin: 0 }}>
                        {turn.partner.name}
                      </h2>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 6, color: '#1A1A2E', opacity: 0.6, fontSize: 14 }}>
                        <MapPin size={12} />
                        <span>Vicino a te</span>
                      </div>
                    </div>
                  )}
                  <div className="card-flag" style={{ padding: '32px 24px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#F87171', animation: 'pulse 2s ease-in-out infinite' }}>
                      <Flag size={20} />
                      <span style={{ fontSize: 14, fontWeight: 600 }}>Scopri la flag...</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* BACK */}
              <div className="flip-back">
                <div
                  style={{
                    position: 'relative',
                    background: '#FFFFFF',
                    borderRadius: 28,
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  }}
                >
                  {/* Accept overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 28,
                      background: 'rgba(74,222,128,0.15)',
                      border: '4px solid #4ADE80',
                      pointerEvents: 'none',
                      opacity: acceptOpacity,
                      transition: isDragging ? 'none' : 'opacity 0.2s',
                    }}
                  >
                    <Heart size={80} color="#4ADE80" fill="#4ADE80" />
                  </div>

                  {/* Reject overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 28,
                      background: 'rgba(248,113,113,0.15)',
                      border: '4px solid #F87171',
                      pointerEvents: 'none',
                      opacity: rejectOpacity,
                      transition: isDragging ? 'none' : 'opacity 0.2s',
                    }}
                  >
                    <HeartCrack size={80} color="#F87171" />
                  </div>
                  {/* Partner header */}
                  {illustrations[turn.redFlag.id] ? (
                    <div className="card-header" style={{ background: '#FCA5A5', padding: '20px 24px', textAlign: 'center' }}>
                      <h2 style={{ fontSize: 24, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, color: '#1A1A2E', margin: '0 0 4px' }}>
                        {turn.partner.name}
                      </h2>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, color: '#1A1A2E', opacity: 0.6, fontSize: 13, marginBottom: 14 }}>
                        <MapPin size={12} />
                        <span>Vicino a te</span>
                      </div>
                      <div className="card-illustration" style={{
                        display: 'inline-block',
                        padding: 8,
                        borderRadius: 16,
                        background: '#FFFFFF',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                      }}>
                        <img
                          src={illustrations[turn.redFlag.id]}
                          alt=""
                          style={{
                            display: 'block',
                            width: '100%',
                            maxWidth: 340,
                            aspectRatio: '340 / 180',
                            borderRadius: 10,
                            objectFit: 'cover',
                            background: '#FFFFFF',
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="card-header" style={{ background: '#FCA5A5', padding: '32px 24px', textAlign: 'center' }}>
                      <div
                        className="card-avatar"
                        style={{
                          width: 80,
                          height: 80,
                          margin: '0 auto 12px',
                          borderRadius: 24,
                          background: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 36,
                          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                        }}
                      >
                        {turn.partner.gender === 'male' ? '👨' : '👩'}
                      </div>
                      <h2 style={{ fontSize: 26, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, color: '#1A1A2E', margin: 0 }}>
                        {turn.partner.name}
                      </h2>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 6, color: '#1A1A2E', opacity: 0.6, fontSize: 14 }}>
                        <MapPin size={12} />
                        <span>Vicino a te</span>
                      </div>
                    </div>
                  )}

                  {/* Flag section */}
                  <div className="card-flag" style={{ padding: '20px 24px 16px' }}>
                    <p style={{ fontSize: 17, color: '#1A1A2E', fontWeight: 500, lineHeight: 1.5, margin: 0 }}>
                      {redFlagText}
                    </p>
                  </div>

                  {/* History button */}
                  {turn.acceptedInTurn.length > 0 && (
                    <div className="card-history" style={{ padding: '0 24px 16px', textAlign: 'center' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowHistory(true); }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: 12,
                          color: '#F87171',
                          background: 'rgba(167,139,250,0.1)',
                          border: 'none',
                          borderRadius: 99,
                          padding: '6px 14px',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          fontWeight: 600,
                        }}
                      >
                        <History size={14} />
                        Precedenti ({turn.acceptedInTurn.length}/{MAX_ACCEPT_PER_TURN})
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 16, flexShrink: 0 }}>
        <button
          onClick={() => { if (isFlipped) doReject(); }}
          disabled={!isFlipped}
          style={{
            width: 56,
            height: 56,
            borderRadius: 20,
            background: '#FFFFFF',
            border: '2px solid #F87171',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isFlipped ? 'pointer' : 'not-allowed',
            opacity: isFlipped ? 1 : 0.3,
            color: '#F87171',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          }}
        >
          <HeartCrack size={24} />
        </button>
        <button
          onClick={() => { if (isFlipped) doAccept(); }}
          disabled={!isFlipped}
          style={{
            width: 56,
            height: 56,
            borderRadius: 20,
            background: '#FFFFFF',
            border: '2px solid #4ADE80',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isFlipped ? 'pointer' : 'not-allowed',
            opacity: isFlipped ? 1 : 0.3,
            color: '#4ADE80',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          }}
        >
          <Heart size={24} fill="#4ADE80" />
        </button>
      </div>

      {/* End game */}
      <button
        onClick={() => setShowConfirm(true)}
        style={{
          marginTop: 12,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 12,
          color: '#9CA3AF',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        <XCircle size={14} />
        Termina partita
      </button>

      {/* History modal */}
      {showHistory && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.5)',
            padding: 24,
          }}
          onClick={() => setShowHistory(false)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 24,
              width: '100%',
              maxWidth: 360,
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 12px' }}>
              <h3 style={{ fontSize: 16, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, color: '#1A1A2E', margin: 0 }}>
                Red flag accumulate
              </h3>
              <button
                onClick={() => setShowHistory(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: '#F3F4F6',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#6B7280',
                }}
              >
                <X size={16} />
              </button>
            </div>
            <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {turn.acceptedInTurn.map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    padding: '10px 14px',
                    background: f.category === 'green' ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.06)',
                    borderRadius: 14,
                    border: `1px solid ${f.category === 'green' ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.15)'}`,
                  }}
                >
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>
                    {f.category === 'green' ? '💚' : '🚩'}
                  </span>
                  <span style={{ fontSize: 14, color: '#1A1A2E', fontWeight: 500, lineHeight: 1.4 }}>
                    {turn.partner.gender === 'male' ? f.maleText : f.femaleText}
                  </span>
                </div>
              ))}
              <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center', margin: '4px 0 0', fontWeight: 500 }}>
                {turn.acceptedInTurn.length}/{MAX_ACCEPT_PER_TURN} accettate
              </p>
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <ConfirmModal
          message="Sei sicuro di voler terminare la partita?"
          onConfirm={onEndGame}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
