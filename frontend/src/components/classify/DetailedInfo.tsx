import { useState, useEffect } from 'react';
import type { ClassificationData } from '../../types/artefact';

const COLORS = { primary: '#c9a87c', textDark: '#2c2420', white: '#fff' };

export default function DetailedInfo({ result }: { result: ClassificationData }) {
    const { prediction, alternatives } = result; 
    const [language, setLanguage] = useState<'EN' | 'KI'>('EN');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Responsive listener to fix the layout on small screens
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Accessing translated fields (Ensure your backend splits the Gemini string into these keys)
    const displaySignificance = language === 'EN' 
        ? prediction.culturalSignificance 
        : (prediction as any).gikuyuDescription || "...";

    const displayDescription = language === 'EN' 
        ? prediction.description 
        : (prediction as any).gikuyuHistory || "...";

    return (
        <section className="fade-in" style={containerStyle}>
            {/* Language Toggle Button */}
            <button onClick={() => setLanguage(language === 'EN' ? 'KI' : 'EN')} style={toggleStyle}>
                {language === 'EN' ? '🌍 Gĩkũyũ' : '🇬🇧 English'}
            </button>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr', 
                gap: '1.5rem' 
            }}>
                {/* Main Content Area */}
                <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.8rem', color: COLORS.textDark }}>
                        {language === 'EN' ? 'Significance' : 'Ũtari'}
                    </h3>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: '#444', marginBottom: '1.5rem' }}>
                        {displaySignificance}
                    </p>
                    
                    <h4 style={{ fontSize: '1rem', color: '#666', marginBottom: '0.5rem' }}>
                        {language === 'EN' ? 'History' : 'Ũhoro wa Tene'}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: '#777', lineHeight: '1.4' }}>
                        {displayDescription}
                    </p>

                    {/* Similar Items / Alternatives */}
                    {alternatives && alternatives.length > 0 && (
                        <div style={{ marginTop: '1.5rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: COLORS.primary, letterSpacing: '1px' }}>
                                SIMILAR ITEMS
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
                                {alternatives.map((alt, idx) => (
                                    <span key={idx} style={badgeStyle}>{alt.label}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Meta Info */}
                <aside style={metaStyle}>
                    <DetailItem label="ERA" value={prediction.era} />
                    <DetailItem label="CATEGORY" value={prediction.category} />
                    <DetailItem label="MATERIALS" value={prediction.materials.join(', ')} />
                </aside>
            </div>
        </section>
    );
}

/**
 * Sub-component for the sidebar items
 */
function DetailItem({ label, value }: { label: string, value: string }) {
    return (
        <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.65rem', color: '#999', fontWeight: 'bold', marginBottom: '2px' }}>{label}</p>
            <p style={{ fontSize: '0.85rem', fontWeight: '500', color: COLORS.textDark }}>{value}</p>
        </div>
    );
}

// --- STYLES ---

const containerStyle: React.CSSProperties = { 
    marginTop: '1.5rem', 
    backgroundColor: COLORS.white, 
    padding: '1.5rem', 
    borderRadius: '12px', 
    position: 'relative', 
    borderLeft: `6px solid ${COLORS.primary}`, 
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)' 
};

const toggleStyle: React.CSSProperties = { 
    position: 'absolute', 
    top: '12px', 
    right: '12px', 
    fontSize: '0.75rem', 
    fontWeight: '600',
    padding: '6px 12px', 
    borderRadius: '20px', 
    cursor: 'pointer', 
    border: '1px solid #eee',
    backgroundColor: '#fff',
    zIndex: 10
};

const metaStyle: React.CSSProperties = { 
    backgroundColor: '#faf9f7', 
    padding: '1.2rem', 
    borderRadius: '8px',
    height: 'fit-content'
};

const badgeStyle: React.CSSProperties = { 
    fontSize: '0.7rem', 
    backgroundColor: '#f0f0f0', 
    padding: '5px 10px', 
    borderRadius: '4px', 
    color: '#666',
    border: '1px solid #e5e5e5',
    textTransform: 'capitalize'
};