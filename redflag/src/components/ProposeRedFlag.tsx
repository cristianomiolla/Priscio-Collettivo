import { useState } from 'react';
import { X, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { GOOGLE_SHEET_URL } from '../config';

interface ProposeRedFlagProps {
  onClose: () => void;
}

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function ProposeRedFlag({ onClose }: ProposeRedFlagProps) {
  const [text, setText] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const canSubmit = text.trim() && status === 'idle';

  const handleSubmit = async () => {
    if (!canSubmit) return;
    if (!GOOGLE_SHEET_URL) {
      setStatus('error');
      return;
    }

    setStatus('sending');
    try {
      const url = new URL(GOOGLE_SHEET_URL);
      url.searchParams.set('text', text.trim());
      await fetch(url.toString(), { mode: 'no-cors' });
      setStatus('success');
      setText('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        background: 'rgba(26,26,46,0.5)',
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 28,
          padding: 24,
          maxWidth: 420,
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
          animation: 'fadeInUp 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, color: '#1A1A2E', margin: 0 }}>
            Proponi una Red Flag
          </h2>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#F0F0F0',
              border: 'none',
              cursor: 'pointer',
              color: '#6B7280',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {status === 'success' ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '24px 0' }}>
            <CheckCircle size={48} color="#4ADE80" />
            <p style={{ fontSize: 16, fontWeight: 600, color: '#1A1A2E', margin: 0, textAlign: 'center' }}>
              Grazie! La tua red flag e' stata inviata.
            </p>
            <p style={{ fontSize: 13, color: '#6B7280', margin: 0, textAlign: 'center' }}>
              La valuteremo e potrebbe apparire nelle prossime versioni del gioco!
            </p>
            <button
              onClick={() => setStatus('idle')}
              style={{
                marginTop: 8,
                padding: '10px 24px',
                background: 'linear-gradient(135deg, #EF4444, #F87171)',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: 14,
                fontFamily: 'inherit',
                borderRadius: 14,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Proponi un'altra
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: 13, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
              Hai un'idea per una red flag divertente? Proponila e potrebbe finire nel gioco!
            </p>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#1A1A2E', display: 'block', marginBottom: 6 }}>
                La tua red flag
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder='Es: "Gli/Le puzzano i piedi."'
                maxLength={200}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  borderRadius: 14,
                  border: '2px solid #E5E7EB',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#F87171')}
                onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
              />
            </div>

            {status === 'error' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#EF4444', fontSize: 13 }}>
                <AlertCircle size={16} />
                <span>Errore nell'invio. Riprova.</span>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '12px 24px',
                background: canSubmit
                  ? 'linear-gradient(135deg, #EF4444, #F87171)'
                  : '#E5E7EB',
                color: canSubmit ? '#FFFFFF' : '#9CA3AF',
                fontWeight: 600,
                fontSize: 15,
                fontFamily: 'inherit',
                borderRadius: 16,
                border: 'none',
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                boxShadow: canSubmit ? '0 4px 16px rgba(239,68,68,0.25)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {status === 'sending' ? (
                'Invio...'
              ) : (
                <>
                  <Send size={16} />
                  Invia proposta
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
