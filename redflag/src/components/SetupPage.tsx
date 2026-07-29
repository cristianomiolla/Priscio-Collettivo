import { useState } from 'react';
import { Plus, Trash2, ArrowLeft, Play, User } from 'lucide-react';
import type { Gender, Player } from '../types';
import { createPlayer } from '../game/engine';
import { MIN_PLAYERS, MAX_PLAYERS } from '../config';

interface PlayerEntry {
  name: string;
  partnerGender: Gender;
}

interface SetupPageProps {
  onStart: (players: Player[]) => void;
  onBack: () => void;
}

const genderOptions: { value: Gender; label: string; emoji: string }[] = [
  { value: 'male', label: 'Uomo', emoji: '👨' },
  { value: 'female', label: 'Donna', emoji: '👩' },
];

export default function SetupPage({ onStart, onBack }: SetupPageProps) {
  const [entries, setEntries] = useState<PlayerEntry[]>([
    { name: '', partnerGender: 'female' },
  ]);

  const canAdd = entries.length < MAX_PLAYERS;
  const filledEntries = entries.filter((e) => e.name.trim().length > 0);
  const canStart = filledEntries.length >= MIN_PLAYERS;

  function addPlayer() {
    if (!canAdd) return;
    setEntries((prev) => [...prev, { name: '', partnerGender: 'female' }]);
  }

  function removePlayer(index: number) {
    if (entries.length <= MIN_PLAYERS) return;
    setEntries((prev) => prev.filter((_, i) => i !== index));
  }

  function updateName(index: number, name: string) {
    setEntries((prev) => prev.map((e, i) => (i === index ? { ...e, name } : e)));
  }

  function updateGender(index: number, partnerGender: Gender) {
    setEntries((prev) => prev.map((e, i) => (i === index ? { ...e, partnerGender } : e)));
  }

  function handleStart() {
    if (!canStart) return;
    const players = filledEntries.map((e) => createPlayer(e.name.trim(), e.partnerGender));
    onStart(players);
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100svh',
        background: '#F0F0F0',
        color: '#1A1A2E',
      }}
    >
      {/* HEADER */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          background: 'rgba(240,240,240,0.95)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div
          style={{
            maxWidth: 480,
            margin: '0 auto',
            width: '100%',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <button
            onClick={onBack}
            style={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 14,
              border: 'none',
              background: '#FFFFFF',
              cursor: 'pointer',
              color: '#6B7280',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <ArrowLeft size={20} />
          </button>

          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: 18, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, margin: 0, color: '#1A1A2E' }}>
              Nuova partita
            </h1>
            <p style={{ fontSize: 11, color: '#9CA3AF', margin: '2px 0 0' }}>
              {filledEntries.length === 0
                ? `Aggiungi almeno ${MIN_PLAYERS} giocatore`
                : `${filledEntries.length} giocator${filledEntries.length === 1 ? 'e' : 'i'} pronti`}
            </p>
          </div>

          <div
            style={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 14,
              background: '#FCA5A5',
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: '#1A1A2E' }}>
              {filledEntries.length}/{MAX_PLAYERS}
            </span>
          </div>
        </div>
      </div>

      {/* PLAYER LIST */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 16px 140px',
        }}
      >
        <div
          style={{
            maxWidth: 480,
            margin: '0 auto',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {entries.map((entry, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 16px',
                borderRadius: 20,
                background: '#FFFFFF',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  background: index % 2 === 0 ? '#FCA5A5' : '#FECACA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <User size={18} color="#1A1A2E" />
              </div>

              {/* Name + Gender */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <input
                  type="text"
                  value={entry.name}
                  onChange={(e) => updateName(index, e.target.value)}
                  placeholder={`Giocatore ${index + 1}`}
                  maxLength={20}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#1A1A2E',
                    fontSize: 15,
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    padding: 0,
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                  <span style={{ fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: 2 }}>
                    Cerca
                  </span>
                  {genderOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateGender(index, opt.value)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '3px 10px',
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 600,
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                        border: 'none',
                        background: entry.partnerGender === opt.value
                          ? '#FCA5A5'
                          : '#F0F0F0',
                        color: entry.partnerGender === opt.value
                          ? '#1A1A2E'
                          : '#9CA3AF',
                      }}
                    >
                      <span style={{ fontSize: 12 }}>{opt.emoji}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delete */}
              {entries.length > MIN_PLAYERS && (
                <button
                  onClick={() => removePlayer(index)}
                  style={{
                    width: 36,
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 12,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: '#F87171',
                    flexShrink: 0,
                  }}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}

          {/* Add player */}
          {canAdd && (
            <button
              onClick={addPlayer}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '14px 0',
                borderRadius: 20,
                border: '2px dashed rgba(0,0,0,0.1)',
                background: 'transparent',
                color: '#9CA3AF',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                fontFamily: 'inherit',
              }}
            >
              <Plus size={18} />
              Aggiungi giocatore
            </button>
          )}
        </div>
      </div>

      {/* START BUTTON */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          background: 'linear-gradient(to top, #F0F0F0 60%, transparent)',
          padding: '32px 16px 24px',
        }}
      >
        <div style={{ maxWidth: 480, margin: '0 auto', width: '100%' }}>
          <button
            onClick={handleStart}
            disabled={!canStart}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '16px 24px',
              borderRadius: 20,
              border: 'none',
              fontSize: 16,
              fontWeight: 700,
              fontFamily: 'inherit',
              cursor: canStart ? 'pointer' : 'not-allowed',
              background: canStart
                ? 'linear-gradient(135deg, #EF4444, #F87171)'
                : '#D1D5DB',
              color: canStart ? '#FFFFFF' : '#9CA3AF',
              boxShadow: canStart ? '0 8px 24px rgba(239,68,68,0.3)' : 'none',
            }}
          >
            <Play size={20} />
            Inizia partita
          </button>
        </div>
      </div>
    </div>
  );
}
