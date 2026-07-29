import { useState, useEffect } from 'react';
import { Heart, HeartCrack, MapPin, AlertTriangle } from 'lucide-react';
import type { ExPartnerOffer as ExPartnerOfferType, Player } from '../types';

interface ExPartnerOfferProps {
  offer: ExPartnerOfferType;
  player: Player;
  onAccept: () => void;
  onReject: () => void;
}

export default function ExPartnerOffer({ offer, player, onAccept, onReject }: ExPartnerOfferProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  const { rejectedPartner } = offer;
  const { partner, revealedFlags, rejectionFlag, rejectedByPlayerName } = rejectedPartner;
  const allKnownFlags = [...revealedFlags, rejectionFlag];

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
            boxShadow: '0 8px 32px rgba(251,191,36,0.15)',
            border: '2px solid #FBBF24',
          }}
        >
          {/* Partner header - amber themed */}
          <div
            style={{
              background: '#FBBF24',
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
            <h2 style={{ fontSize: 24, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, color: '#1A1A2E', margin: 0 }}>
              {partner.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 6, color: '#1A1A2E', opacity: 0.6, fontSize: 14 }}>
              <MapPin size={12} />
              <span>Vicino a te</span>
            </div>
          </div>

          {/* Ex alert */}
          <div style={{ padding: '20px 24px 8px', textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: 99,
                background: 'rgba(251,191,36,0.15)',
                marginBottom: 12,
              }}
            >
              <AlertTriangle size={16} color="#D97706" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#D97706' }}>
                Ex di {rejectedByPlayerName}
              </span>
            </div>
            <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 4px', lineHeight: 1.5 }}>
              {rejectedByPlayerName} {partner.gender === 'male' ? 'lo' : 'la'} ha rifiutat{partner.gender === 'male' ? 'o' : 'a'}!
              Vuoi dargli una seconda possibilit{'\u00E0'}?
            </p>
          </div>

          {/* Known red flags */}
          {allKnownFlags.length > 0 && (
            <div style={{ padding: '12px 24px 24px' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Red flag note
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {allKnownFlags.map((f, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      padding: '10px 14px',
                      background: 'rgba(248,113,113,0.06)',
                      borderRadius: 14,
                      border: '1px solid rgba(248,113,113,0.15)',
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
              </div>
            </div>
          )}
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
            {'\u2190'} Rifiuta &nbsp;&nbsp;&nbsp; Accetta {'\u2192'}
          </p>
        </div>
      </div>
    </div>
  );
}
