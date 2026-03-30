import { useState, type ChangeEvent } from 'react';
import Navbar from "../components/Navbar";
import { classifyArtefact } from '../services/api';
import type { ClassificationData } from '../types/artefact';

// --- Styled Constants ---
const COLORS = {
    primary: '#c9a87c',
    primaryHover: '#d4b890',
    background: '#f5f1ed',
    textDark: '#2c2420',
    textMedium: '#5a4a3a',
    textLight: '#888',
    white: '#fff',
    error: '#c00',
    errorBg: '#ffe6e6'
};

export default function Classify() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<ClassificationData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(file);
        setError(null);
        setResult(null);

        const reader = new FileReader();
        reader.onload = (event) => {
            setSelectedImage(event.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleAnalyze = async () => {
        if (!imageFile) return;

        setIsAnalyzing(true);
        setError(null);

        try {
            const response = await classifyArtefact(imageFile);
            setResult(response);
        } catch (err) {
            setError("Failed to classify image. Please try again.");
            console.error("Classification error:", err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: COLORS.background, minHeight: '100vh' }}>
            <Navbar />

            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
                {/* Header */}
                <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: '300', color: COLORS.textDark, marginBottom: '1rem' }}>
                        Classify Your <span style={{ fontWeight: '600', color: COLORS.primary }}>Artefact</span>
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: COLORS.textMedium }}>
                        Upload an image and let AI identify your Kikuyu cultural artefact
                    </p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
                    
                    {/* Left: Upload Section */}
                    <section style={cardStyle}>
                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} id="file-upload" />
                        <label htmlFor="file-upload" style={uploadBoxStyle}>
                            <span style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}>📤</span>
                            <p style={{ fontWeight: '600', fontSize: '1.1rem', color: COLORS.textDark }}>Click to Upload Image</p>
                            <p style={{ fontSize: '0.9rem', color: COLORS.textLight, marginTop: '0.5rem' }}>PNG, JPG, JPEG (Max 10MB)</p>
                        </label>

                        {selectedImage && (
                            <button 
                                onClick={handleAnalyze} 
                                disabled={isAnalyzing} 
                                style={{ ...buttonStyle, backgroundColor: isAnalyzing ? COLORS.primaryHover : COLORS.primary, cursor: isAnalyzing ? 'not-allowed' : 'pointer' }}
                            >
                                {isAnalyzing ? '🔍 Analyzing...' : '✨ Identify Artefact'}
                            </button>
                        )}
                    </section>

                    {/* Right: Preview & Status Section */}
                    <section style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        {selectedImage ? (
                            <>
                                <img src={selectedImage} alt="Preview" style={previewImageStyle} />
                                {isAnalyzing && <div className="spinner" style={spinnerStyle} />}
                                {result && !isAnalyzing && <QuickResult result={result} />}
                                {error && <div style={errorStyle}>{error}</div>}
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', color: '#aaa' }}>
                                <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>🖼️</span>
                                <p>Upload an image to get started</p>
                            </div>
                        )}
                    </section>
                </div>

                {/* Detailed Results */}
                {result && !isAnalyzing && <DetailedInfo result={result} />}
            </main>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes spin { to { transform: rotate(360deg); } }
                .spinner { animation: spin 1s linear infinite; }
                .fade-in { animation: fadeIn 0.6s ease forwards; }
            `}</style>
        </div>
    );
}

// --- Sub-Components ---

function QuickResult({ result }: { result: ClassificationData }) {
    return (
        <div className="fade-in" style={{ width: '100%', textAlign: 'center' }}>
            <p style={labelStyle}>Top Prediction</p>
            <h2 style={{ color: COLORS.textDark, fontSize: '1.8rem', margin: '0.5rem 0', textTransform: 'capitalize' }}>
                {result.prediction.name}
            </h2>
            <div style={confidenceBarBg}>
                <div style={{ ...confidenceBarFill, width: result.prediction.confidence }} />
            </div>
            <p style={{ color: COLORS.primary, fontWeight: '600' }}>{result.prediction.confidence} Confident</p>
        </div>
    );
}

function DetailedInfo({ result }: { result: ClassificationData }) {
    const { prediction, alternatives } = result;
    return (
        <section className="fade-in" style={detailSectionStyle}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: COLORS.textDark }}>Cultural Significance</h2>
                    <p style={descriptionStyle}>{prediction.culturalSignificance}</p>
                    
                    <h3 style={subHeaderStyle}>Description</h3>
                    <p style={{ color: '#666', lineHeight: '1.7' }}>{prediction.description}</p>

                    {alternatives && alternatives.length > 0 && (
                        <div style={{ marginTop: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Alternative Predictions</h3>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {alternatives.map((alt, i) => (
                                    <div key={i} style={altCardStyle}>
                                        <p style={{ fontWeight: '600', textTransform: 'capitalize' }}>{alt.name}</p>
                                        <p style={{ color: COLORS.primary, fontSize: '0.9rem' }}>{alt.confidence}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <aside style={metaCardStyle}>
                    <h4 style={{ color: COLORS.primary, marginBottom: '1.5rem', fontSize: '1.2rem' }}>Details</h4>
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
        <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.85rem', color: COLORS.textLight, marginBottom: '0.3rem' }}>{label}</p>
            <p style={{ fontWeight: '600', color: COLORS.textDark }}>{value}</p>
        </div>
    );
}

// --- Specific Styles ---
const cardStyle: React.CSSProperties = {
    backgroundColor: COLORS.white,
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
};

const uploadBoxStyle: React.CSSProperties = {
    display: 'block',
    border: `2px dashed ${COLORS.primary}`,
    borderRadius: '12px',
    padding: '3rem 2rem',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'background 0.3s'
};

const buttonStyle: React.CSSProperties = {
    marginTop: '1.5rem',
    width: '100%',
    padding: '1rem',
    color: COLORS.white,
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.3s'
};

const previewImageStyle: React.CSSProperties = {
    maxWidth: '100%',
    borderRadius: '12px',
    maxHeight: '300px',
    objectFit: 'cover',
    marginBottom: '1.5rem'
};

const spinnerStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    border: '4px solid #f5f1ed',
    borderTopColor: COLORS.primary,
    borderRadius: '50%',
    margin: '0 auto 1rem'
};

const detailSectionStyle: React.CSSProperties = {
    marginTop: '4rem',
    backgroundColor: COLORS.white,
    padding: '3rem',
    borderRadius: '16px',
    borderLeft: `8px solid ${COLORS.primary}`,
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
};

const confidenceBarBg: React.CSSProperties = { height: '12px', backgroundColor: '#eee', borderRadius: '6px', overflow: 'hidden', margin: '1rem 0' };
const confidenceBarFill: React.CSSProperties = { backgroundColor: COLORS.primary, height: '100%', transition: 'width 1s ease-out' };
const labelStyle: React.CSSProperties = { fontSize: '0.75rem', color: COLORS.textLight, textTransform: 'uppercase', letterSpacing: '1px' };
const descriptionStyle: React.CSSProperties = { lineHeight: '1.8', color: '#444', fontSize: '1.05rem', marginBottom: '2rem' };
const subHeaderStyle: React.CSSProperties = { marginTop: '2rem', fontSize: '1.3rem', color: COLORS.textDark, marginBottom: '0.8rem' };
const altCardStyle: React.CSSProperties = { backgroundColor: '#faf8f5', padding: '1rem', borderRadius: '8px', flex: 1 };
const metaCardStyle: React.CSSProperties = { backgroundColor: '#fcfaf8', padding: '2rem', borderRadius: '12px', height: 'fit-content' };
const errorStyle: React.CSSProperties = { backgroundColor: COLORS.errorBg, color: COLORS.error, padding: '1rem', borderRadius: '8px', marginTop: '1rem' };