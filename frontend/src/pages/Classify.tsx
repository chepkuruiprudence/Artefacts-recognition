import { useState } from 'react';
import Navbar from "../components/Navbar";

export default function Classify() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        // Simulate analysis
        setTimeout(() => setIsAnalyzing(false), 2000);
    };

    return (
        <div style={{
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            backgroundColor: '#f5f1ed',
            minHeight: '100vh'
        }}>
            <Navbar />
            
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '4rem 2rem'
            }}>
                {/* Header */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '4rem'
                }}>
                    <h1 style={{
                        fontSize: '3rem',
                        fontWeight: '300',
                        color: '#2c2420',
                        marginBottom: '1rem'
                    }}>
                        Classify Your <span style={{ fontWeight: '600', color: '#c9a87c' }}>Artefact</span>
                    </h1>
                    <p style={{
                        fontSize: '1.1rem',
                        color: '#5a4a3a',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Upload an image of a Kikuyu cultural artefact and our AI will identify it for you
                    </p>
                </div>

                {/* Upload Section */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '3rem',
                    marginBottom: '3rem'
                }}>
                    {/* Upload Box */}
                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        padding: '3rem',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                        textAlign: 'center'
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
                                border: '3px dashed #c9a87c',
                                borderRadius: '12px',
                                padding: '4rem 2rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#faf8f5';
                                e.currentTarget.style.borderColor = '#d4b890';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.borderColor = '#c9a87c';
                            }}
                        >
                            <div style={{
                                fontSize: '3rem',
                                marginBottom: '1rem',
                                color: '#c9a87c'
                            }}>📷</div>
                            <h3 style={{
                                fontSize: '1.2rem',
                                fontWeight: '600',
                                color: '#2c2420',
                                marginBottom: '0.5rem'
                            }}>Click to Upload</h3>
                            <p style={{
                                color: '#5a4a3a',
                                fontSize: '0.9rem'
                            }}>PNG, JPG or JPEG (MAX. 10MB)</p>
                        </label>

                        {selectedImage && (
                            <button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing}
                                style={{
                                    marginTop: '2rem',
                                    backgroundColor: '#c9a87c',
                                    color: '#ffffff',
                                    padding: '1rem 3rem',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                                    width: '100%',
                                    transition: 'all 0.3s ease',
                                    opacity: isAnalyzing ? 0.7 : 1
                                }}
                                onMouseEnter={(e) => {
                                    if (!isAnalyzing) e.currentTarget.style.backgroundColor = '#d4b890';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#c9a87c';
                                }}
                            >
                                {isAnalyzing ? 'Analyzing...' : 'Analyze Artefact'}
                            </button>
                        )}
                    </div>

                    {/* Preview Box */}
                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        padding: '3rem',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {selectedImage ? (
                            <>
                                <img
                                    src={selectedImage}
                                    alt="Uploaded artefact"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '400px',
                                        borderRadius: '12px',
                                        marginBottom: '1.5rem'
                                    }}
                                />
                                {isAnalyzing && (
                                    <div style={{
                                        textAlign: 'center',
                                        color: '#5a4a3a'
                                    }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            border: '4px solid #f5f1ed',
                                            borderTopColor: '#c9a87c',
                                            borderRadius: '50%',
                                            margin: '0 auto 1rem',
                                            animation: 'spin 1s linear infinite'
                                        }}></div>
                                        <p>Analyzing your artefact...</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div style={{
                                textAlign: 'center',
                                color: '#a39489'
                            }}>
                                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🖼️</div>
                                <p>Your uploaded image will appear here</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* How It Works */}
                <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    padding: '3rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
                }}>
                    <h2 style={{
                        fontSize: '2rem',
                        fontWeight: '400',
                        color: '#2c2420',
                        marginBottom: '2rem',
                        textAlign: 'center'
                    }}>
                        How It <span style={{ fontWeight: '600', color: '#c9a87c' }}>Works</span>
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '2rem'
                    }}>
                        {[
                            { step: '01', title: 'Upload Image', desc: 'Take a clear photo of the artefact' },
                            { step: '02', title: 'AI Analysis', desc: 'Our AI identifies the cultural item' },
                            { step: '03', title: 'Get Results', desc: 'Receive detailed information and history' }
                        ].map((item, idx) => (
                            <div key={idx} style={{ textAlign: 'center' }}>
                                <div style={{
                                    fontSize: '2.5rem',
                                    fontWeight: '200',
                                    color: '#e8dfd5',
                                    marginBottom: '1rem'
                                }}>{item.step}</div>
                                <h3 style={{
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    color: '#2c2420',
                                    marginBottom: '0.5rem'
                                }}>{item.title}</h3>
                                <p style={{
                                    color: '#5a4a3a',
                                    fontSize: '0.9rem'
                                }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}