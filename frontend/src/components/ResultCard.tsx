import type { ClassificationResult } from '../types/artefact';

interface ResultCardProps {
  result: ClassificationResult;
  // Note: Your interface defines alternatives as an array of objects
  // We will use those for the "Other Possibilities" section
}

export default function ResultCard({ result }: ResultCardProps) {
  // Access the nested data from topPrediction
  const { label, confidence } = result.topPrediction;
  const confidencePct = Math.round(confidence * 100);

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(196,140,60,0.25)',
      borderRadius: '20px',
      overflow: 'hidden',
      animation: 'fadeSlideUp 0.6s ease forwards',
    }}>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fillBar {
          from { width: 0%; }
          to { width: var(--target-width); }
        }
      `}</style>

      {/* Header with artefact name */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(196,140,60,0.15) 0%, rgba(196,140,60,0.05) 100%)',
        padding: '1.5rem 2rem',
        borderBottom: '1px solid rgba(196,140,60,0.15)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <div>
            <p style={{
              fontFamily: '"EB Garamond", Georgia, serif',
              fontSize: '0.7rem',
              color: '#C48C3C',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              marginBottom: '0.4rem',
            }}>
              Identified Artefact
            </p>
            <h2 style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '1.8rem',
              fontWeight: 700,
              color: '#E8D5A3',
              margin: 0,
              lineHeight: 1.1,
            }}>
              {label}
            </h2>
          </div>

          {/* Confidence badge */}
          <div style={{
            textAlign: 'center',
            background: 'rgba(196,140,60,0.1)',
            border: '1px solid rgba(196,140,60,0.3)',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            minWidth: '70px',
          }}>
            <div style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#C48C3C',
              lineHeight: 1,
            }}>
              {confidencePct}%
            </div>
            <div style={{
              fontFamily: '"EB Garamond", Georgia, serif',
              fontSize: '0.65rem',
              color: 'rgba(232,213,163,0.5)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginTop: '3px',
            }}>
              Confidence
            </div>
          </div>
        </div>

        {/* Confidence bar */}
        <div style={{
          marginTop: '1rem',
          height: '3px',
          background: 'rgba(196,140,60,0.1)',
          borderRadius: '100px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${confidencePct}%`,
            background: 'linear-gradient(90deg, #8B5E20, #C48C3C, #E8D5A3)',
            borderRadius: '100px',
            animation: 'fillBar 1s ease 0.3s both',
            ['--target-width' as any]: `${confidencePct}%`,
          }} />
        </div>
      </div>

      {/* Since ClassificationResult (UI type) is separate from ArtefactDetails (Content type), 
          ensure you are passing the correct description strings from your state logic */}
      <div style={{ padding: '1.5rem 2rem' }}>
        <p style={{
          fontFamily: '"EB Garamond", Georgia, serif',
          fontSize: '0.7rem',
          color: '#C48C3C',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          marginBottom: '1rem',
        }}>
          Other Possibilities
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {result.alternatives.map((alt, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{
                fontFamily: '"EB Garamond", Georgia, serif',
                fontSize: '0.9rem',
                color: 'rgba(232,213,163,0.6)',
                minWidth: '140px',
              }}>
                {alt.label}
              </span>
              <div style={{ flex: 1, height: '2px', background: 'rgba(196,140,60,0.1)', borderRadius: '100px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.round(alt.confidence * 100)}%`,
                  background: 'rgba(196,140,60,0.4)',
                  borderRadius: '100px',
                }} />
              </div>
              <span style={{
                fontFamily: '"EB Garamond", Georgia, serif',
                fontSize: '0.85rem',
                color: 'rgba(196,140,60,0.6)',
                minWidth: '36px',
                textAlign: 'right',
              }}>
                {Math.round(alt.confidence * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}