import type { ClassificationData } from '../../types/artefact';

const COLORS = { primary: '#c9a87c', textDark: '#2c2420', textLight: '#888' };

export default function QuickResult({ result }: { result: ClassificationData }) {
    return (
        <div className="fade-in" style={{ width: '100%', textAlign: 'center', marginTop: '0.5rem' }}>
            <p style={{ fontSize: '0.65rem', color: COLORS.textLight, textTransform: 'uppercase', letterSpacing: '1px' }}>Result</p>
            <h2 style={{ color: COLORS.textDark, fontSize: '1.4rem', margin: '0.2rem 0', textTransform: 'capitalize' }}>
                {result.prediction.name}
            </h2>
            <div style={{ height: '6px', backgroundColor: '#f0f0f0', borderRadius: '3px', overflow: 'hidden', margin: '0.5rem 0' }}>
                <div style={{ backgroundColor: COLORS.primary, height: '100%', width: result.prediction.confidence, transition: 'width 1s ease' }} />
            </div>
            <p style={{ color: COLORS.primary, fontWeight: '600', fontSize: '0.85rem' }}>{result.prediction.confidence} Confidence</p>
        </div>
    );
}