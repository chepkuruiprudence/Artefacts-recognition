import type{ ArtefactResult } from '../types/artefact'

interface ResultCardProps {
  result: ArtefactResult
  topPredictions?: ArtefactResult[]
}

export default function ResultCard({ result, topPredictions }: ResultCardProps) {
  const confidencePct = Math.round(result.confidence * 100)

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
              {result.name}
            </h2>
            {result.period && (
              <p style={{
                fontFamily: '"EB Garamond", Georgia, serif',
                fontSize: '0.85rem',
                color: 'rgba(196,140,60,0.7)',
                marginTop: '0.3rem',
              }}>
                {result.period}
              </p>
            )}
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
            ['--target-width' as string]: `${confidencePct}%`,
          }} />
        </div>
      </div>

      {/* Cultural use section */}
      <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(196,140,60,0.1)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem',
        }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'rgba(196,140,60,0.15)',
            border: '1px solid rgba(196,140,60,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: '1rem',
          }}>
            🏺
          </div>
          <div>
            <p style={{
              fontFamily: '"EB Garamond", Georgia, serif',
              fontSize: '0.7rem',
              color: '#C48C3C',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              marginBottom: '0.35rem',
            }}>
              Cultural Use in Kikuyu Society
            </p>
            <p style={{
              fontFamily: '"EB Garamond", Georgia, serif',
              fontSize: '1.05rem',
              color: '#E8D5A3',
              lineHeight: 1.7,
              margin: 0,
            }}>
              {result.cultural_use}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(196,140,60,0.1)' }}>
        <p style={{
          fontFamily: '"EB Garamond", Georgia, serif',
          fontSize: '0.7rem',
          color: '#C48C3C',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          marginBottom: '0.5rem',
        }}>
          Description
        </p>
        <p style={{
          fontFamily: '"EB Garamond", Georgia, serif',
          fontSize: '1rem',
          color: 'rgba(232,213,163,0.8)',
          lineHeight: 1.8,
          margin: 0,
        }}>
          {result.description}
        </p>
      </div>

      {/* Top predictions */}
      {topPredictions && topPredictions.length > 1 && (
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
            {topPredictions.slice(1, 4).map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{
                  fontFamily: '"EB Garamond", Georgia, serif',
                  fontSize: '0.9rem',
                  color: 'rgba(232,213,163,0.6)',
                  minWidth: '140px',
                }}>
                  {p.name}
                </span>
                <div style={{ flex: 1, height: '2px', background: 'rgba(196,140,60,0.1)', borderRadius: '100px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.round(p.confidence * 100)}%`,
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
                  {Math.round(p.confidence * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
