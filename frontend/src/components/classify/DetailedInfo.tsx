import { useState } from 'react';
import type { ClassificationData } from '../../types/artefact';

const COLORS = { primary: '#c9a87c', textDark: '#2c2420', white: '#fff' };

export default function DetailedInfo({ result }: { result: ClassificationData }) {
    const { prediction, alternatives } = result;
    const [language, setLanguage] = useState<'EN' | 'KI'>('EN');

    const displaySignificance = language === 'EN' ? prediction.culturalSignificance : (prediction as any).culturalSignificanceKI || "...";
    const displayDescription = language === 'EN' ? prediction.description : (prediction as any).descriptionKI || "...";

    return (
        <section className="fade-in" style={containerStyle}>
            <button onClick={() => setLanguage(language === 'EN' ? 'KI' : 'EN')} style={toggleStyle}>
                {language === 'EN' ? '🌍 Gĩkũyũ' : '🇬🇧 English'}
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.8rem' }}>{language === 'EN' ? 'Significance' : 'Ũtari'}</h3>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: '#444', marginBottom: '1rem' }}>{displaySignificance}</p>
                    
                    <h4 style={{ fontSize: '1rem', color: '#666' }}>{language === 'EN' ? 'History' : 'Ũhoro wa Tene'}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#777' }}>{displayDescription}</p>
                </div>

                <aside style={metaStyle}>
                    <DetailItem label="ERA" value={prediction.era} />
                    <DetailItem label="CATEGORY" value={prediction.category} />
                    <DetailItem label="MATERIALS" value={prediction.materials.join(', ')} />
                </aside>
            </div>
        </section>
    );
}

function DetailItem({ label, value }: { label: string, value: string }) {
    return (
        <div style={{ marginBottom: '0.8rem' }}>
            <p style={{ fontSize: '0.65rem', color: '#999', fontWeight: 'bold' }}>{label}</p>
            <p style={{ fontSize: '0.85rem', fontWeight: '500' }}>{value}</p>
        </div>
    );
}

const containerStyle: React.CSSProperties = { marginTop: '1.5rem', backgroundColor: COLORS.white, padding: '1.5rem', borderRadius: '12px', position: 'relative', borderLeft: `6px solid ${COLORS.primary}`, boxShadow: '0 4px 15px rgba(0,0,0,0.05)' };
const toggleStyle: React.CSSProperties = { position: 'absolute', top: '10px', right: '10px', fontSize: '0.7rem', padding: '4px 10px', borderRadius: '15px', cursor: 'pointer', border: '1px solid #eee' };
const metaStyle: React.CSSProperties = { backgroundColor: '#faf9f7', padding: '1rem', borderRadius: '8px' };