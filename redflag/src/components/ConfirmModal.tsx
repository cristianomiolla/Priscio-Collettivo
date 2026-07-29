import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)',
        padding: 24,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 24,
          width: '100%',
          maxWidth: 320,
          padding: '28px 24px 20px',
          boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
          textAlign: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: 'rgba(239,68,68,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <AlertTriangle size={24} color="#EF4444" />
        </div>

        <p
          style={{
            fontSize: 15,
            fontFamily: "'Fredoka', sans-serif",
            fontWeight: 500,
            color: '#1A1A2E',
            margin: '0 0 24px',
            lineHeight: 1.5,
          }}
        >
          {message}
        </p>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '12px 0',
              fontSize: 14,
              fontFamily: "'Fredoka', sans-serif",
              fontWeight: 500,
              color: '#6B7280',
              background: '#F3F4F6',
              border: 'none',
              borderRadius: 14,
              cursor: 'pointer',
            }}
          >
            Annulla
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '12px 0',
              fontSize: 14,
              fontFamily: "'Fredoka', sans-serif",
              fontWeight: 500,
              color: '#FFFFFF',
              background: 'linear-gradient(135deg, #EF4444, #DC2626)',
              border: 'none',
              borderRadius: 14,
              cursor: 'pointer',
            }}
          >
            Termina
          </button>
        </div>
      </div>
    </div>
  );
}
