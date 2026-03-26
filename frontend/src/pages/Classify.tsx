import { useState } from 'react';
import Navbar from "../components/Navbar";
import { classifyArtefact } from '../services/api';
import type { ClassificationData, ArtefactDetails } from '../types/artefact';

export default function Classify() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<ClassificationData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target?.result as string);
                setResult(null);
                setError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (!imageFile) return;
        
        setIsAnalyzing(true);
        setResult(null);
        setError(null);

        try {
            const response = await classifyArtefact(imageFile);
            setResult(response);
            console.log("✅ Classification successful:", response);
        } catch (err) {
            console.error("❌ Classification failed:", err);
            setError("Failed to classify image. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Parse confidence string to number
    const getConfidenceValue = (confidenceStr: string): number => {
        return parseFloat(confidenceStr.replace('%', ''));
    };

    return (
        <div style={{ 
            fontFamily: "'Inter', sans-serif", 
            backgroundColor: '#f5f1ed', 
            minHeight: '100vh' 
        }}>
            <Navbar />
            
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ 
                        fontSize: '3rem', 
                        fontWeight: '300', 
                        color: '#2c2420',
                        marginBottom: '1rem'
                    }}>
                        Classify Your <span style={{ fontWeight: '600', color: '#c9a87c' }}>Artefact</span>
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: '#5a4a3a' }}>
                        Upload an image and let AI identify your Kikuyu cultural artefact
                    </p>
                </div>

                {/* Upload & Preview Section */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '3rem',
                    marginBottom: '3rem'
                }}>
                    {/* Left: Upload Box */}
                    <div style={{ 
                        backgroundColor: '#fff', 
                        borderRadius: '16px', 
                        padding: '2rem', 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)' 
                    }}>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageUpload} 
                            style={{ display: 'none' }} 
                            id="file-upload" 
                        />
                        <label 
                            htmlFor="file-upload" 
                            style={{ 
                                display: 'block', 
                                border: '2px dashed #c9a87c', 
                                borderRadius: '12px', 
                                padding: '3rem 2rem', 
                                cursor: 'pointer', 
                                textAlign: 'center',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#faf8f5'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <span style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}>📤</span>
                            <p style={{ fontWeight: '600', fontSize: '1.1rem', color: '#2c2420' }}>
                                Click to Upload Image
                            </p>
                            <p style={{ fontSize: '0.9rem', color: '#888', marginTop: '0.5rem' }}>
                                PNG, JPG, JPEG (Max 10MB)
                            </p>
                        </label>

                        {selectedImage && (
                            <button 
                                onClick={handleAnalyze} 
                                disabled={isAnalyzing} 
                                style={{ 
                                    marginTop: '1.5rem', 
                                    width: '100%', 
                                    padding: '1rem', 
                                    backgroundColor: isAnalyzing ? '#d4b890' : '#c9a87c',
                                    color: '#fff', 
                                    border: 'none', 
                                    borderRadius: '8px', 
                                    cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                                    fontWeight: '600',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s'
                                }}
                            >
                                {isAnalyzing ? '🔍 Analyzing...' : '✨ Identify Artefact'}
                            </button>
                        )}
                    </div>

                    {/* Right: Preview & Quick Result */}
                    <div style={{ 
                        backgroundColor: '#fff', 
                        borderRadius: '16px', 
                        padding: '2rem', 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {selectedImage ? (
                            <>
                                <img 
                                    src={selectedImage} 
                                    alt="Preview" 
                                    style={{ 
                                        maxWidth: '100%', 
                                        borderRadius: '12px', 
                                        maxHeight: '300px',
                                        objectFit: 'cover',
                                        marginBottom: '1.5rem'
                                    }} 
                                />
                                
                                {isAnalyzing && (
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            border: '4px solid #f5f1ed',
                                            borderTopColor: '#c9a87c',
                                            borderRadius: '50%',
                                            margin: '0 auto 1rem',
                                            animation: 'spin 1s linear infinite'
                                        }}></div>
                                        <p style={{ color: '#5a4a3a' }}>Analyzing image...</p>
                                    </div>
                                )}

                                {result && !isAnalyzing && (
                                    <div style={{ 
                                        width: '100%',
                                        textAlign: 'center',
                                        animation: 'fadeIn 0.5s' 
                                    }}>
                                        <p style={{ 
                                            fontSize: '0.75rem', 
                                            color: '#888',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px',
                                            marginBottom: '0.5rem'
                                        }}>
                                            Top Prediction
                                        </p>
                                        <h2 style={{ 
                                            color: '#2c2420', 
                                            fontSize: '1.8rem',
                                            margin: '0.5rem 0',
                                            textTransform: 'capitalize'
                                        }}>
                                            {result.prediction.name}
                                        </h2>
                                        
                                        {/* Confidence Bar */}
                                        <div style={{ 
                                            height: '12px', 
                                            backgroundColor: '#eee', 
                                            borderRadius: '6px', 
                                            overflow: 'hidden',
                                            margin: '1rem 0'
                                        }}>
                                            <div style={{ 
                                                width: result.prediction.confidence,
                                                backgroundColor: '#c9a87c', 
                                                height: '100%', 
                                                transition: 'width 1s ease-out'
                                            }}></div>
                                        </div>
                                        
                                        <p style={{ 
                                            color: '#c9a87c', 
                                            fontWeight: '600',
                                            fontSize: '1.1rem'
                                        }}>
                                            {result.prediction.confidence} Confident
                                        </p>

                                        <p style={{
                                            fontSize: '0.85rem',
                                            color: '#666',
                                            marginTop: '0.5rem'
                                        }}>
                                            Processing time: {result.processingTime}
                                        </p>
                                    </div>
                                )}

                                {error && (
                                    <div style={{
                                        backgroundColor: '#ffe6e6',
                                        color: '#c00',
                                        padding: '1rem',
                                        borderRadius: '8px',
                                        marginTop: '1rem'
                                    }}>
                                        {error}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', color: '#aaa' }}>
                                <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>
                                    🖼️
                                </span>
                                <p>Upload an image to get started</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Detailed Results Section */}
                {result && !isAnalyzing && (
                    <div style={{ 
                        marginTop: '4rem', 
                        backgroundColor: '#fff', 
                        padding: '3rem', 
                        borderRadius: '16px', 
                        borderLeft: '8px solid #c9a87c',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        animation: 'fadeIn 0.8s' 
                    }}>
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: '2fr 1fr', 
                            gap: '3rem' 
                        }}>
                            {/* Left: Cultural Info */}
                            <div>
                                <h2 style={{ 
                                    fontSize: '2rem', 
                                    marginBottom: '1.5rem',
                                    color: '#2c2420'
                                }}>
                                    Cultural Significance
                                </h2>
                                <p style={{ 
                                    lineHeight: '1.8', 
                                    color: '#444',
                                    fontSize: '1.05rem',
                                    marginBottom: '2rem'
                                }}>
                                    {result.prediction.culturalSignificance}
                                </p>
                                
                                <h3 style={{ 
                                    marginTop: '2rem',
                                    fontSize: '1.3rem',
                                    color: '#2c2420',
                                    marginBottom: '0.8rem'
                                }}>
                                    Description
                                </h3>
                                <p style={{ 
                                    color: '#666',
                                    lineHeight: '1.7'
                                }}>
                                    {result.prediction.description}
                                </p>

                                {/* Alternative Predictions */}
                                {result.alternatives && result.alternatives.length > 0 && (
                                    <div style={{ marginTop: '2rem' }}>
                                        <h3 style={{ 
                                            fontSize: '1.1rem',
                                            color: '#2c2420',
                                            marginBottom: '1rem'
                                        }}>
                                            Alternative Predictions
                                        </h3>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            {result.alternatives.map((alt, idx) => (
                                                <div 
                                                    key={idx}
                                                    style={{
                                                        backgroundColor: '#faf8f5',
                                                        padding: '1rem',
                                                        borderRadius: '8px',
                                                        flex: 1
                                                    }}
                                                >
                                                    <p style={{ 
                                                        fontWeight: '600',
                                                        color: '#2c2420',
                                                        marginBottom: '0.3rem',
                                                        textTransform: 'capitalize'
                                                    }}>
                                                        {alt.name}
                                                    </p>
                                                    <p style={{ 
                                                        color: '#c9a87c',
                                                        fontSize: '0.9rem'
                                                    }}>
                                                        {alt.confidence}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right: Details Card */}
                            <div style={{ 
                                backgroundColor: '#fcfaf8', 
                                padding: '2rem', 
                                borderRadius: '12px',
                                height: 'fit-content'
                            }}>
                                <h4 style={{ 
                                    color: '#c9a87c', 
                                    marginBottom: '1.5rem',
                                    fontSize: '1.2rem',
                                    fontWeight: '600'
                                }}>
                                    Details
                                </h4>
                                
                                <div style={{ marginBottom: '1rem' }}>
                                    <p style={{ 
                                        fontSize: '0.85rem',
                                        color: '#888',
                                        marginBottom: '0.3rem'
                                    }}>
                                        ERA
                                    </p>
                                    <p style={{ 
                                        fontWeight: '600',
                                        color: '#2c2420'
                                    }}>
                                        {result.prediction.era}
                                    </p>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <p style={{ 
                                        fontSize: '0.85rem',
                                        color: '#888',
                                        marginBottom: '0.3rem'
                                    }}>
                                        CATEGORY
                                    </p>
                                    <p style={{ 
                                        fontWeight: '600',
                                        color: '#2c2420'
                                    }}>
                                        {result.prediction.category}
                                    </p>
                                </div>

                                <div>
                                    <p style={{ 
                                        fontSize: '0.85rem',
                                        color: '#888',
                                        marginBottom: '0.3rem'
                                    }}>
                                        MATERIALS
                                    </p>
                                    <p style={{ 
                                        fontWeight: '600',
                                        color: '#2c2420',
                                        lineHeight: '1.5'
                                    }}>
                                        {result.prediction.materials.join(', ')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}