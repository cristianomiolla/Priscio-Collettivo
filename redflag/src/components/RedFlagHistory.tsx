import { X, Flag, Heart, HeartCrack } from 'lucide-react';
import type { Player } from '../types';
import { STAGES } from '../config';

interface RedFlagHistoryProps {
  player: Player;
  onClose: () => void;
}

export default function RedFlagHistory({ player, onClose }: RedFlagHistoryProps) {
  const accepted = player.acceptedFlags;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(26,26,46,0.4)',
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.2s ease-out forwards',
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 420,
          maxHeight: '80vh',
          background: '#FFFFFF',
          borderRadius: '28px 28px 0 0',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.3s ease-out forwards',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Flag size={16} color="#F87171" />
            <h3 style={{ fontSize: 15, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, color: '#1A1A2E', margin: 0 }}>
              Storico di {player.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: '#F0F0F0',
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

        {/* Stats summary */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '12px 20px',
            borderBottom: '1px solid rgba(0,0,0,0.04)',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#16A34A', fontWeight: 600 }}>
            <Heart size={14} fill="#4ADE80" color="#4ADE80" />
            <span>{accepted.length} accettate</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#DC2626', fontWeight: 600 }}>
            <HeartCrack size={14} />
            <span>{player.rejectedCount} rifiutate</span>
          </div>
        </div>

        {/* List */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '12px 20px' }}>
          {accepted.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: 14, padding: '32px 0' }}>
              Nessuna red flag accettata ancora.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {accepted.map((flag, i) => {
                const stage = STAGES[i];
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
                    <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.5, margin: 0 }}>
                      {player.partnerGender === 'female'
                        ? flag.femaleText
                        : flag.maleText}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
