// import { useState, type ChangeEvent } from 'react';
// import Navbar from "../components/Navbar";
// import { classifyArtefact } from '../services/api';
// import type { ClassificationData } from '../types/artefact';
// import CameraCapture from '../components/CameraCapture';

// // --- Styled Constants ---
// const COLORS = {
//     primary: '#c9a87c',
//     primaryHover: '#d4b890',
//     background: '#f5f1ed',
//     textDark: '#2c2420',
//     textMedium: '#5a4a3a',
//     textLight: '#888',
//     white: '#fff',
//     error: '#c00',
//     errorBg: '#ffe6e6'
// };

// export default function Classify() {
//     const [selectedImage, setSelectedImage] = useState<string | null>(null);
//     const [imageFile, setImageFile] = useState<File | null>(null);
//     const [isAnalyzing, setIsAnalyzing] = useState(false);
//     const [isCameraOpen, setIsCameraOpen] = useState(false);
//     const [result, setResult] = useState<ClassificationData | null>(null);
//     const [error, setError] = useState<string | null>(null);

//     const onCameraCapture = (file: File, previewUrl: string) => {
//         setImageFile(file);
//         setSelectedImage(previewUrl);
//         setIsCameraOpen(false);
//         setError(null);
//         setResult(null);
//     };

//     const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (!file) return;

//         setImageFile(file);
//         setError(null);
//         setResult(null);

//         const reader = new FileReader();
//         reader.onload = (event) => {
//             setSelectedImage(event.target?.result as string);
//         };
//         reader.readAsDataURL(file);
//     };

//     const handleAnalyze = async () => {
//         if (!imageFile) return;

//         setIsAnalyzing(true);
//         setError(null);

//         try {
//             const response = await classifyArtefact(imageFile);
//             setResult(response);
//         } catch (err) {
//             setError("Failed to classify image. Please try again.");
//             console.error("Classification error:", err);
//         } finally {
//             setIsAnalyzing(false);
//         }
//     };

//     return (
//         <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: COLORS.background, minHeight: '100vh' }}>
//             <Navbar />

//             <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
//                 {/* Header */}
//                 <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
//                     <h1 style={{ fontSize: '3rem', fontWeight: '300', color: COLORS.textDark, marginBottom: '1rem' }}>
//                         Classify Your <span style={{ fontWeight: '600', color: COLORS.primary }}>Artefact</span>
//                     </h1>
//                     <p style={{ fontSize: '1.1rem', color: COLORS.textMedium }}>
//                         Upload an image or take a photo to identify Kikuyu cultural artefacts
//                     </p>
//                 </header>

//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
                    
//                     {/* Left: Input Section */}
//                     <section style={cardStyle}>
//                         <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} id="file-upload" />
                        
//                         {!isCameraOpen ? (
//                             <>
//                                 <label htmlFor="file-upload" style={uploadBoxStyle}>
//                                     <span style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}>📤</span>
//                                     <p style={{ fontWeight: '600', fontSize: '1.1rem', color: COLORS.textDark }}>
//                                         {selectedImage ? "Change Image" : "Upload from Gallery"}
//                                     </p>
//                                     <p style={{ fontSize: '0.9rem', color: COLORS.textLight, marginTop: '0.5rem' }}>PNG, JPG (Max 10MB)</p>
//                                 </label>

//                                 <div style={{ textAlign: 'center', margin: '1.5rem 0', color: COLORS.textLight, fontWeight: 'bold' }}>OR</div>

//                                 <button 
//                                     onClick={() => setIsCameraOpen(true)}
//                                     style={{ ...buttonStyle, backgroundColor: COLORS.textDark, marginTop: 0 }}
//                                 >
//                                     📸 Use Live Camera
//                                 </button>
//                             </>
//                         ) : (
//                             <CameraCapture 
//                                 onCapture={onCameraCapture} 
//                                 onClose={() => setIsCameraOpen(false)} 
//                             />
//                         )}

//                         {selectedImage && !isCameraOpen && (
//                             <button 
//                                 onClick={handleAnalyze} 
//                                 disabled={isAnalyzing} 
//                                 style={{ 
//                                     ...buttonStyle, 
//                                     backgroundColor: isAnalyzing ? COLORS.primaryHover : COLORS.primary, 
//                                     cursor: isAnalyzing ? 'not-allowed' : 'pointer' 
//                                 }}
//                             >
//                                 {isAnalyzing ? '🔍 Analyzing...' : '✨ Identify Artefact'}
//                             </button>
//                         )}
//                     </section>

//                     {/* Right: Preview & Feedback Section */}
//                     <section style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
//                         {selectedImage ? (
//                             <div style={{ width: '100%', textAlign: 'center' }}>
//                                 <img src={selectedImage} alt="Preview" style={previewImageStyle} />
//                                 {isAnalyzing && (
//                                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                                         <div className="spinner" style={spinnerStyle} />
//                                         <p style={{ color: COLORS.primary, fontWeight: '500' }}>AI is processing...</p>
//                                     </div>
//                                 )}
//                                 {result && !isAnalyzing && <QuickResult result={result} />}
//                                 {error && <div style={errorStyle}>{error}</div>}
//                             </div>
//                         ) : (
//                             <div style={{ textAlign: 'center', color: '#aaa' }}>
//                                 <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>🖼️</span>
//                                 <p>Capture or upload an image to see the result</p>
//                             </div>
//                         )}
//                     </section>
//                 </div>

//                 {/* Detailed Results Section */}
//                 {result && !isAnalyzing && <DetailedInfo result={result} />}
//             </main>

//             <style>{`
//                 @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
//                 @keyframes spin { to { transform: rotate(360deg); } }
//                 .spinner { animation: spin 1s linear infinite; }
//                 .fade-in { animation: fadeIn 0.6s ease forwards; }
//             `}</style>
//         </div>
//     );
// }

// // --- Sub-Components ---

// function QuickResult({ result }: { result: ClassificationData }) {
//     return (
//         <div className="fade-in" style={{ width: '100%', textAlign: 'center', marginTop: '1rem' }}>
//             <p style={labelStyle}>AI Analysis Result</p>
//             <h2 style={{ color: COLORS.textDark, fontSize: '1.8rem', margin: '0.5rem 0', textTransform: 'capitalize' }}>
//                 {result.prediction.name}
//             </h2>
//             <div style={confidenceBarBg}>
//                 <div style={{ ...confidenceBarFill, width: result.prediction.confidence }} />
//             </div>
//             <p style={{ color: COLORS.primary, fontWeight: '600' }}>{result.prediction.confidence} Match Confidence</p>
//         </div>
//     );
// }

// function DetailedInfo({ result }: { result: ClassificationData }) {
//     const { prediction, alternatives } = result;
//     const [language, setLanguage] = useState<'EN' | 'KI'>('EN');

//     const displaySignificance = language === 'EN' 
//         ? prediction.culturalSignificance 
//         : (prediction as any).culturalSignificanceKI || "Ũhoro ũyũ ndũrathuthurio na Gĩkũyũ...";

//     const displayDescription = language === 'EN'
//         ? prediction.description
//         : (prediction as any).descriptionKI || "Maũndũ marĩa makonainie na gĩtĩ kĩrĩa kĩonania...";

//     return (
//         <section className="fade-in" style={{ ...detailSectionStyle, position: 'relative' }}>
            
//             <button 
//                 onClick={() => setLanguage(language === 'EN' ? 'KI' : 'EN')}
//                 style={languageToggleStyle}
//             >
//                 {language === 'EN' ? '🌍 Translate to Gĩkũyũ' : '🇬🇧 Show English'}
//             </button>

//             <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) 1fr', gap: '3rem' }}>
//                 <div>
//                     <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: COLORS.textDark }}>
//                         {language === 'EN' ? 'Cultural Significance' : 'Ũtari wa Kĩndũ Gĩkĩ'}
//                     </h2>
                    
//                     <p style={descriptionStyle}>
//                         {displaySignificance}
//                     </p>
                    
//                     <h3 style={subHeaderStyle}>
//                         {language === 'EN' ? 'Historical Context' : 'Ũhoro wa Tene'}
//                     </h3>
//                     <p style={{ color: '#666', lineHeight: '1.7', fontSize: '1rem' }}>
//                         {displayDescription}
//                     </p>

//                     {alternatives && alternatives.length > 0 && (
//                         <div style={{ marginTop: '3rem' }}>
//                             <h3 style={{ fontSize: '1.1rem', marginBottom: '1.2rem', color: COLORS.textMedium }}>
//                                 {language === 'EN' ? 'Other Possible Matches' : 'Indũ Ingĩ Ihanaine na Gĩkĩ'}
//                             </h3>
//                             <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
//                                 {alternatives.map((alt, i) => (
//                                     <div key={i} style={altCardStyle}>
//                                         <p style={{ fontWeight: '600', textTransform: 'capitalize', margin: 0 }}>{alt.name}</p>
//                                         <p style={{ color: COLORS.primary, fontSize: '0.85rem', marginTop: '0.2rem' }}>{alt.confidence} Match</p>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 <aside style={metaCardStyle}>
//                     <h4 style={{ color: COLORS.primary, marginBottom: '1.5rem', fontSize: '1.1rem', borderBottom: `1px solid #eee`, paddingBottom: '0.5rem' }}>
//                         {language === 'EN' ? 'Artefact Metadata' : 'Ũhoro Makĩria'}
//                     </h4>
//                     <DetailItem label={language === 'EN' ? "PROBABLE ERA" : "HĨNDĨ ĨRĨA KYARĨ KUO"} value={prediction.era} />
//                     <DetailItem label={language === 'EN' ? "CULTURAL CATEGORY" : "MŨTHEMABA WA KĨNDŨ"} value={prediction.category} />
//                     <DetailItem label={language === 'EN' ? "TRADITIONAL MATERIALS" : "MĨTHEMABA YA MITI/NYŨMBŨ"} value={prediction.materials.join(', ')} />
//                 </aside>
//             </div>
//         </section>
//     );
// }

// function DetailItem({ label, value }: { label: string, value: string }) {
//     return (
//         <div style={{ marginBottom: '1.2rem' }}>
//             <p style={{ fontSize: '0.75rem', color: COLORS.textLight, marginBottom: '0.2rem', fontWeight: 'bold' }}>{label}</p>
//             <p style={{ fontWeight: '500', color: COLORS.textDark, lineHeight: '1.4' }}>{value}</p>
//         </div>
//     );
// }

// // --- Reusable Styles ---
// const cardStyle: React.CSSProperties = {
//     backgroundColor: COLORS.white,
//     borderRadius: '16px',
//     padding: '2rem',
//     boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
//     display: 'flex',
//     flexDirection: 'column'
// };

// const uploadBoxStyle: React.CSSProperties = {
//     display: 'block',
//     border: `2px dashed ${COLORS.primary}`,
//     borderRadius: '12px',
//     padding: '3.5rem 2rem',
//     cursor: 'pointer',
//     textAlign: 'center',
//     transition: 'all 0.3s ease',
//     backgroundColor: '#fafaf9'
// };

// const buttonStyle: React.CSSProperties = {
//     marginTop: '1.5rem',
//     width: '100%',
//     padding: '1.1rem',
//     color: COLORS.white,
//     border: 'none',
//     borderRadius: '10px',
//     fontWeight: '600',
//     fontSize: '1rem',
//     transition: 'all 0.3s ease',
//     boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
// };

// const previewImageStyle: React.CSSProperties = {
//     maxWidth: '100%',
//     borderRadius: '12px',
//     maxHeight: '400px',
//     objectFit: 'contain',
//     marginBottom: '1.5rem',
//     boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
// };

// const spinnerStyle: React.CSSProperties = {
//     width: '40px',
//     height: '40px',
//     border: '4px solid #f5f1ed',
//     borderTopColor: COLORS.primary,
//     borderRadius: '50%',
//     margin: '0 auto 1rem'
// };

// const detailSectionStyle: React.CSSProperties = {
//     marginTop: '2rem',
//     backgroundColor: COLORS.white,
//     padding: '3.5rem',
//     borderRadius: '20px',
//     borderLeft: `10px solid ${COLORS.primary}`,
//     boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
// };

// const languageToggleStyle: React.CSSProperties = {
//     position: 'absolute',
//     top: '20px',
//     right: '20px',
//     backgroundColor: COLORS.white,
//     border: `1px solid ${COLORS.primary}`,
//     color: COLORS.primary,
//     padding: '0.5rem 1rem',
//     borderRadius: '20px',
//     fontSize: '0.85rem',
//     fontWeight: '600',
//     cursor: 'pointer',
//     transition: 'all 0.2s ease',
//     boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
//     zIndex: 10
// };

// const confidenceBarBg: React.CSSProperties = { height: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px', overflow: 'hidden', margin: '1rem 0' };
// const confidenceBarFill: React.CSSProperties = { backgroundColor: COLORS.primary, height: '100%', transition: 'width 1.2s cubic-bezier(0.17, 0.67, 0.83, 0.67)' };
// const labelStyle: React.CSSProperties = { fontSize: '0.75rem', color: COLORS.textLight, textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 'bold' };
// const descriptionStyle: React.CSSProperties = { lineHeight: '1.8', color: '#333', fontSize: '1.1rem', marginBottom: '2rem', fontStyle: 'italic' };
// const subHeaderStyle: React.CSSProperties = { marginTop: '2rem', fontSize: '1.3rem', color: COLORS.textDark, marginBottom: '0.8rem', fontWeight: '600' };
// const altCardStyle: React.CSSProperties = { backgroundColor: '#f8f6f4', padding: '0.8rem 1.2rem', borderRadius: '10px', border: '1px solid #eee' };
// const metaCardStyle: React.CSSProperties = { backgroundColor: '#faf9f7', padding: '2rem', borderRadius: '15px', height: 'fit-content', border: '1px solid #f0ede9' };
// const errorStyle: React.CSSProperties = { backgroundColor: COLORS.errorBg, color: COLORS.error, padding: '1rem', borderRadius: '8px', marginTop: '1rem', textAlign: 'center', width: '100%' };



import { useState, type ChangeEvent } from 'react';
import Navbar from "../components/Navbar";
import { classifyArtefact } from '../services/api';
import type { ClassificationData } from '../types/artefact';
import CameraCapture from '../components/CameraCapture';
import QuickResult from '../components/classify/QuickResult';
import DetailedInfo from '../components/classify/DetailedInfo';

const COLORS = { primary: '#c9a87c', background: '#f5f1ed', textDark: '#2c2420', white: '#fff' };

export default function Classify() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [result, setResult] = useState<ClassificationData | null>(null);

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (event) => setSelectedImage(event.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleAnalyze = async () => {
        if (!imageFile) return;
        setIsAnalyzing(true);
        try {
            const response = await classifyArtefact(imageFile);
            setResult(response);
        } catch (err) {
            alert("Analysis failed.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div style={{ backgroundColor: COLORS.background, minHeight: '100vh', paddingBottom: '2rem' }}>
            <Navbar />
            <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
                <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.8rem', color: COLORS.textDark }}>Classify <span style={{ color: COLORS.primary }}>Artefact</span></h1>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    {/* Input Card */}
                    <section style={smallCard}>
                        {!isCameraOpen ? (
                            <>
                                <label htmlFor="file-upload" style={uploadArea}>
                                    <span style={{ fontSize: '1.5rem' }}>📤</span>
                                    <p style={{ fontSize: '0.85rem', fontWeight: '600' }}>{selectedImage ? "Change" : "Upload"}</p>
                                </label>
                                <input type="file" id="file-upload" hidden onChange={handleImageUpload} />
                                <button onClick={() => setIsCameraOpen(true)} style={btnSecondary}>📸 Camera</button>
                            </>
                        ) : (
                            <CameraCapture onCapture={(f, p) => { setImageFile(f); setSelectedImage(p); setIsCameraOpen(false); }} onClose={() => setIsCameraOpen(false)} />
                        )}
                        
                        {selectedImage && !isCameraOpen && (
                            <button onClick={handleAnalyze} disabled={isAnalyzing} style={btnPrimary}>
                                {isAnalyzing ? '...' : 'Identify'}
                            </button>
                        )}
                    </section>

                    {/* Preview Card */}
                    <section style={smallCard}>
                        {selectedImage ? (
                            <div style={{ textAlign: 'center' }}>
                                <img src={selectedImage} alt="Preview" style={{ width: '100%', borderRadius: '8px', maxHeight: '180px', objectFit: 'cover' }} />
                                {result && !isAnalyzing && <QuickResult result={result} />}
                            </div>
                        ) : (
                            <p style={{ fontSize: '0.8rem', color: '#999', textAlign: 'center' }}>No image selected</p>
                        )}
                    </section>
                </div>

                {result && !isAnalyzing && <DetailedInfo result={result} />}
            </main>
        </div>
    );
}

// Minimal Styles
const smallCard: React.CSSProperties = { backgroundColor: COLORS.white, borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center' };
const uploadArea: React.CSSProperties = { border: `1px dashed ${COLORS.primary}`, borderRadius: '8px', padding: '1.5rem', textAlign: 'center', cursor: 'pointer' };
const btnPrimary: React.CSSProperties = { marginTop: '10px', padding: '10px', backgroundColor: COLORS.primary, color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' };
const btnSecondary: React.CSSProperties = { marginTop: '10px', padding: '8px', backgroundColor: '#eee', border: 'none', borderRadius: '6px', fontSize: '0.8rem' };