import { STAGES } from '../config';

interface ProgressBarProps {
  currentStageIndex: number;
}

export default function ProgressBar({ currentStageIndex }: ProgressBarProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 4,
        width: '100%',
        maxWidth: 420,
        margin: '0 auto',
        padding: '0 16px',
      }}
    >
      {STAGES.map((stage, i) => {
        const isCompleted = i < currentStageIndex;
        const isCurrent = i === currentStageIndex;

        return (
          <div
            key={stage.id}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 5,
            }}
          >
            {/* Bar segment */}
            <div
              style={{
                width: '100%',
                height: 6,
                borderRadius: 99,
                overflow: 'hidden',
                background: 'rgba(0,0,0,0.06)',
              }}
            >
              <div
                style={{
                  height: '100%',
                  borderRadius: 99,
                  transition: 'width 0.7s ease-out',
                  width: isCompleted ? '100%' : isCurrent ? '50%' : '0%',
                  background: isCompleted
                    ? '#4ADE80'
                    : isCurrent
                      ? '#FCA5A5'
                      : 'transparent',
                  ...(isCurrent ? { animation: 'pulse 2s ease-in-out infinite' } : {}),
                }}
              />
            </div>
            {/* Label */}
            <span
              style={{
                fontSize: 10,
                lineHeight: 1.2,
                textAlign: 'center',
                color: isCompleted ? '#16A34A' : isCurrent ? '#DC2626' : '#9CA3AF',
                fontWeight: isCurrent ? 700 : 500,
              }}
            >
              {stage.emoji} {stage.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
