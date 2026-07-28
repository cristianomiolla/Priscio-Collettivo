import { useState } from 'react';
import { Flag, Heart, Info, X, ChevronRight, Users, Shuffle, CheckCircle } from 'lucide-react';
import logoImg from '../assets/logo.png';

interface HomePageProps {
  onStart: () => void;
}

export default function HomePage({ onStart }: HomePageProps) {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100svh',
        padding: '24px 20px',
        position: 'relative',
        overflow: 'hidden',
        background: '#F0F0F0',
      }}
    >
      {/* Background decorations */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: 60, left: 30, width: 120, height: 120, borderRadius: 28, background: '#DDD6FE', opacity: 0.3, transform: 'rotate(-12deg)' }} />
        <div style={{ position: 'absolute', top: 180, right: 20, width: 80, height: 80, borderRadius: '50%', background: '#C4B5FD', opacity: 0.25 }} />
        <div style={{ position: 'absolute', bottom: 140, left: 50, width: 60, height: 60, borderRadius: '50%', background: '#C4B5FD', opacity: 0.2 }} />
        <div style={{ position: 'absolute', bottom: 200, right: 40, width: 100, height: 100, borderRadius: 24, background: '#DDD6FE', opacity: 0.2, transform: 'rotate(15deg)' }} />
      </div>

      {/* Main content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 32,
          animation: 'fadeInUp 0.8s ease-out',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <img
            src={logoImg}
            alt="Red Flag Game"
            style={{
              width: 140,
              height: 140,
              borderRadius: 32,
              objectFit: 'contain',
              animation: 'bounce 3s ease-in-out infinite',
              filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))',
            }}
          />
          <h1
            style={{
              fontSize: 52,
              fontFamily: "'Fredoka', sans-serif",
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: '#1A1A2E',
              margin: 0,
              lineHeight: 1,
            }}
          >
            Red<br />Flag
          </h1>
          <p
            style={{
              fontSize: 16,
              color: '#6B7280',
              textAlign: 'center',
              maxWidth: 280,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Accetteresti un partner con queste red flag?
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={onStart}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '16px 36px',
            background: '#1A1A2E',
            color: '#DDD6FE',
            fontWeight: 700,
            fontSize: 17,
            fontFamily: 'inherit',
            borderRadius: 20,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(26,26,46,0.2)',
          }}
        >
          <Heart size={20} />
          Avvia partita
          <ChevronRight size={20} />
        </button>

        {/* Instructions link */}
        <button
          onClick={() => setShowInstructions(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: '#6B7280',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: 14,
            fontFamily: 'inherit',
            textDecoration: 'underline',
            textUnderlineOffset: 4,
          }}
        >
          <Info size={16} />
          Come si gioca?
        </button>
      </div>

      {/* Footer */}
      <footer
        style={{
          position: 'absolute',
          bottom: 24,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          fontSize: 12,
          color: '#9CA3AF',
        }}
      >
        <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="Priscio Collettivo" style={{ height: 16, width: 16 }} />
        <a
          href="https://www.prisciocollettivo.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          Un gioco di Priscio Collettivo
        </a>
      </footer>

      {/* Instructions Modal */}
      {showInstructions && (
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
          onClick={() => setShowInstructions(false)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 28,
              padding: 24,
              maxWidth: 420,
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
              animation: 'fadeInUp 0.3s ease-out',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, color: '#1A1A2E', margin: 0 }}>Come si gioca</h2>
              <button
                onClick={() => setShowInstructions(false)}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <InstructionStep
                icon={<Users size={20} color="#A78BFA" />}
                title="1. Aggiungi i giocatori"
                text="Ogni giocatore inserisce il proprio nome e sceglie che tipo di partner cerca (uomo o donna)."
              />
              <InstructionStep
                icon={<Shuffle size={20} color="#8B5CF6" />}
                title="2. Ricevi un match"
                text="Ad ogni turno ti viene proposto un partner casuale con una red flag nascosta. Scorri per scoprirla!"
              />
              <InstructionStep
                icon={<Flag size={20} color="#F87171" />}
                title="3. Accetta o rifiuta"
                text="Swipe a destra per accettare il partner (con la sua red flag) o a sinistra per rifiutarlo e provare con un altro."
              />
              <InstructionStep
                icon={<CheckCircle size={20} color="#4ADE80" />}
                title="4. Completa 5 step"
                text="Ogni giocatore deve accettare 5 partner, uno per ogni fase della relazione: dal primo appuntamento ai figli."
              />
              <InstructionStep
                icon={<Heart size={20} color="#F87171" fill="#F87171" />}
                title="5. Scopri i risultati"
                text="Alla fine scopri il tuo profilo romantico, le red flag che hai accettato e i badge divertenti guadagnati!"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InstructionStep({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <div
        style={{
          flexShrink: 0,
          width: 40,
          height: 40,
          borderRadius: 14,
          background: '#F0F0F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E', margin: '0 0 2px' }}>{title}</h3>
        <p style={{ fontSize: 13, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>{text}</p>
      </div>
    </div>
  );
}
