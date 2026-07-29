import { useState, useEffect, useCallback, useRef } from 'react';
import { Heart, HeartCrack, MapPin, Flame, History, X, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { FlamebackOffer as FlamebackOfferType, Player } from '../types';
import ConfirmModal from './ConfirmModal';
import ProgressBar from './ProgressBar';
import { playSwipeAccept, playSwipeReject } from '../utils/sounds';

const SWIPE_THRESHOLD = 80;

function triggerMiniConfetti() {
  confetti({
    particleCount: 40,
    spread: 60,
    origin: { y: 0.7 },
    colors: ['#FCA5A5', '#FECACA', '#4ADE80', '#F87171'],
    disableForReducedMotion: true,
  });
}

interface FlamebackOfferProps {
  offer: FlamebackOfferType;
  player: Player;
  onAccept: () => void;
  onReject: () => void;
  onEndGame: () => void;
}

export default function FlamebackOffer({ offer, player, onAccept, onReject, onEndGame }: FlamebackOfferProps) {
  const [visible, setVisible] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [exitDir, setExitDir] = useState<'left' | 'right' | null>(null);
  const startX = useRef(0);

  useEffect(() => {
    const timer = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  const handleStart = useCallback((clientX: number) => {
    startX.current = clientX;
    setIsDragging(true);
  }, []);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging) return;
    setOffsetX(clientX - startX.current);
  }, [isDragging]);

  const doAccept = useCallback(() => {
    setExitDir('right');
    triggerMiniConfetti();
    playSwipeAccept();
    setTimeout(onAccept, 300);
  }, [onAccept]);

  const doReject = useCallback(() => {
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

  const { rejectedPartner, newFlag } = offer;
  const { partner, revealedFlags, rejectionFlag } = rejectedPartner;

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
        minHeight: '100svh',
        padding: '24px 16px',
        background: '#F0F0F0',
        overflow: 'hidden',
      }}
    >
      {/* Progress bar */}
      <div style={{ width: '100%', marginBottom: 16, paddingTop: 8, flexShrink: 0 }}>
        <ProgressBar currentStageIndex={player.currentStageIndex} />
      </div>

      {/* Player name */}
      <div style={{ textAlign: 'center', marginBottom: 16, flexShrink: 0 }}>
        <p style={{ fontSize: 14, color: '#9CA3AF', margin: 0 }}>{player.name}</p>
      </div>

      {/* Swipeable card area */}
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
            opacity: visible ? 1 : 0,
            transform: `translateX(${translateX}px) rotate(${rotation}deg) scale(${visible ? 1 : 0.9})`,
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
          {/* Card */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 28,
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(239,68,68,0.18)',
              border: '2px solid #EF4444',
            }}
          >
            {/* Partner header - flame themed */}
            <div
              style={{
                background: 'linear-gradient(135deg, #EF4444, #F97316)',
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
                {partner.gender === 'male' ? '\u{1F468}' : '\u{1F469}'}
              </div>
              <h2 style={{ fontSize: 24, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                {partner.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 6, color: '#FFFFFF', opacity: 0.8, fontSize: 14 }}>
                <MapPin size={12} />
                <span>Vicino a te</span>
              </div>
            </div>

            {/* Flameback alert */}
            <div style={{ padding: '20px 24px 8px', textAlign: 'center' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 16px',
                  borderRadius: 99,
                  background: 'rgba(239,68,68,0.1)',
                  marginBottom: 12,
                }}
              >
                <Flame size={16} color="#EF4444" />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#EF4444' }}>
                  Ritorno di fiamma!
                </span>
              </div>
              <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 4px', lineHeight: 1.5 }}>
                {partner.name} {'\u00E8'} tornat{partner.gender === 'male' ? 'o' : 'a'} e dice:
              </p>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#1A1A2E', margin: '8px 0 4px', fontStyle: 'italic' }}>
                "Sono cambiat{partner.gender === 'male' ? 'o' : 'a'}!"
              </p>
              <p style={{ fontSize: 13, color: '#9CA3AF', margin: '4px 0 0' }}>
                Se rifiuti, passi il turno.
              </p>
            </div>

            {/* Flags: only rejection (removed) and new */}
            <div style={{ padding: '12px 24px 16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {/* Old rejection flag — struck through, marked as removed */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    padding: '10px 14px',
                    background: 'rgba(74,222,128,0.08)',
                    borderRadius: 14,
                    border: '1px solid rgba(74,222,128,0.25)',
                    opacity: 0.7,
                  }}
                >
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>
                    {'\u2705'}
                  </span>
                  <span style={{ fontSize: 14, color: '#6B7280', fontWeight: 500, lineHeight: 1.4, textDecoration: 'line-through' }}>
                    {partner.gender === 'male' ? rejectionFlag.maleText : rejectionFlag.femaleText}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#16A34A', marginLeft: 'auto', flexShrink: 0, alignSelf: 'center', textTransform: 'uppercase' }}>
                    Rimossa
                  </span>
                </div>

                {/* New replacement flag — highlighted */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    padding: '10px 14px',
                    background: 'rgba(239,68,68,0.1)',
                    borderRadius: 14,
                    border: '2px solid #EF4444',
                    boxShadow: '0 2px 8px rgba(239,68,68,0.15)',
                  }}
                >
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>
                    {'\u{1F6A9}'}
                  </span>
                  <span style={{ fontSize: 14, color: '#1A1A2E', fontWeight: 600, lineHeight: 1.4 }}>
                    {partner.gender === 'male' ? newFlag.maleText : newFlag.femaleText}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#EF4444', marginLeft: 'auto', flexShrink: 0, alignSelf: 'center', textTransform: 'uppercase' }}>
                    Nuova
                  </span>
                </div>
              </div>
            </div>

            {/* Precedenti button */}
            {revealedFlags.length > 0 && (
              <div style={{ padding: '0 24px 20px', textAlign: 'center' }}>
                <button
                  onClick={() => setShowHistory(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12,
                    color: '#F87171',
                    background: 'rgba(248,113,113,0.08)',
                    border: 'none',
                    borderRadius: 99,
                    padding: '6px 14px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontWeight: 600,
                  }}
                >
                  <History size={14} />
                  Precedenti ({revealedFlags.length})
                </button>
              </div>
            )}
          </div>

          {/* Accept overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
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
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginTop: 24, flexShrink: 0 }}>
        <button
          onClick={doReject}
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
          onClick={doAccept}
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

      {/* End game */}
      <button
        onClick={() => setShowConfirm(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          margin: '16px auto 0',
          fontSize: 13,
          fontWeight: 500,
          color: '#9CA3AF',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
          flexShrink: 0,
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
                Red flag precedenti
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
              {revealedFlags.map((f, i) => (
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
                    {f.category === 'green' ? '\u{1F49A}' : '\u{1F6A9}'}
                  </span>
                  <span style={{ fontSize: 14, color: '#1A1A2E', fontWeight: 500, lineHeight: 1.4 }}>
                    {partner.gender === 'male' ? f.maleText : f.femaleText}
                  </span>
                </div>
              ))}
              <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center', margin: '4px 0 0', fontWeight: 500 }}>
                {revealedFlags.length} red flag ancora attive
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
