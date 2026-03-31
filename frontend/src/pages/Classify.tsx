import { useState, useEffect, type ChangeEvent } from 'react';
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
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
            <main style={{ maxWidth: '900px', margin: '0 auto', padding: isMobile ? '1rem' : '2rem 1rem' }}>
                <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: isMobile ? '1.5rem' : '1.8rem', color: COLORS.textDark }}>
                        Classify <span style={{ color: COLORS.primary }}>Artefact</span>
                    </h1>
                </header>

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
                    gap: '1.5rem' 
                }}>
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
                                <img src={selectedImage} alt="Preview" style={{ width: '100%', borderRadius: '8px', maxHeight: isMobile ? '250px' : '180px', objectFit: 'cover' }} />
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

const smallCard: React.CSSProperties = { backgroundColor: COLORS.white, borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center' };
const uploadArea: React.CSSProperties = { border: `1px dashed ${COLORS.primary}`, borderRadius: '8px', padding: '1.5rem', textAlign: 'center', cursor: 'pointer' };
const btnPrimary: React.CSSProperties = { marginTop: '10px', padding: '10px', backgroundColor: COLORS.primary, color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' };
const btnSecondary: React.CSSProperties = { marginTop: '10px', padding: '8px', backgroundColor: '#eee', border: 'none', borderRadius: '6px', fontSize: '0.8rem' };