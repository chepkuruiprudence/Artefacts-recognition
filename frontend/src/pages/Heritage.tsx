import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";

// Interface matching your Prisma Schema
interface Artefact {
    id: string;
    name: string;
    category: string;
    era: string;
    description: string;
    images: { url: string; isPrimary: boolean }[];
}

export default function Heritage() {
    const [artefacts, setArtefacts] = useState<Artefact[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('ALL');

    // These match your Prisma ArtefactCategory enum exactly
    const categories = [
        { label: 'All', value: 'ALL' },
        { label: 'Spears', value: 'KIKUYU_SPEARS' },
        { label: 'Stools', value: 'KIKUYU_STOOLS' },
        { label: 'Beadwork', value: 'KIKUYU_BEADWORK' },
        { label: 'Sticks', value: 'KIKUYU_WALKING_STICK' },
        { label: 'Pots', value: 'KIKUYU_POTS' },
        { label: 'Shields', value: 'KIKUYU_SHIELDS' },
        { label: 'Calabash', value: 'KIKUYU_CALABASH' }
    ];

    useEffect(() => {
        const fetchArtefacts = async () => {
            setLoading(true);
            const API_BASE = import.meta.env.VITE_API_URL;

            try {
                // Adjust this URL if your API route differs
                const query = activeCategory === 'ALL' ? '' : `?category=${activeCategory}`;
                const response = await fetch(`${API_BASE}/artefacts${query}`);
                const result = await response.json();
                
                if (result.success) {
                    setArtefacts(result.data.artefacts);
                }
            } catch (error) {
                console.error("Failed to fetch heritage items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchArtefacts();
    }, [activeCategory]);

    return (
        <div style={{
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            backgroundColor: '#f5f1ed',
            minHeight: '100vh'
        }}>
            <Navbar />
            
            {/* Hero Section */}
            <div style={{
                position: 'relative',
                height: '400px',
                background: 'linear-gradient(135deg, #8b6f47 0%, #5a4a3a 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '4rem'
            }}>
                <div style={{ textAlign: 'center', color: '#ffffff' }}>
                    <h1 style={{
                        fontSize: '3.5rem',
                        fontWeight: '300',
                        marginBottom: '1rem'
                    }}>
                        Our <span style={{ fontWeight: '600' }}>Cultural Heritage</span>
                    </h1>
                    <p style={{
                        fontSize: '1.2rem',
                        opacity: 0.95
                    }}>
                        Explore the rich collection of Kikuyu artefacts
                    </p>
                </div>
            </div>

            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '0 2rem 4rem'
            }}>
                {/* Filter Tabs */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '3rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }}>
                    {categories.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => setActiveCategory(cat.value)}
                            style={{
                                padding: '0.7rem 1.8rem',
                                border: '2px solid #c9a87c',
                                backgroundColor: activeCategory === cat.value ? '#c9a87c' : 'transparent',
                                color: activeCategory === cat.value ? '#ffffff' : '#5a4a3a',
                                borderRadius: '8px',
                                fontSize: '0.95rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '5rem' }}>
                        <p style={{ color: '#5a4a3a', fontSize: '1.2rem' }}>Loading our heritage...</p>
                    </div>
                ) : (
                    /* Artefacts Grid */
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '2rem'
                    }}>
                        {artefacts.length > 0 ? artefacts.map((item) => (
                            <div
                                key={item.id}
                                style={{
                                    backgroundColor: '#ffffff',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.12)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
                                }}
                            >
                                <div style={{
                                    height: '250px',
                                    background: `url("${item.images.find(img => img.isPrimary)?.url || item.images[0]?.url || 'https://via.placeholder.com/400'}") center/cover`,
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        backgroundColor: '#c9a87c',
                                        color: '#ffffff',
                                        padding: '0.4rem 1rem',
                                        borderRadius: '20px',
                                        fontSize: '0.7rem',
                                        fontWeight: '600'
                                    }}>
                                        {item.category.replace('KIKUYU_', '').replace('_', ' ')}
                                    </div>
                                </div>
                                <div style={{ padding: '1.5rem' }}>
                                    <h3 style={{
                                        fontSize: '1.3rem',
                                        fontWeight: '600',
                                        color: '#2c2420',
                                        marginBottom: '0.5rem'
                                    }}>
                                        {item.name}
                                    </h3>
                                    <p style={{
                                        color: '#5a4a3a',
                                        fontSize: '0.9rem',
                                        marginBottom: '1rem'
                                    }}>
                                        Era: {item.era}
                                    </p>
                                    <Link 
                                        to={`/heritage/${item.id}`} 
                                        style={{
                                            color: '#c9a87c',
                                            textDecoration: 'none',
                                            fontSize: '0.9rem',
                                            fontWeight: '600'
                                        }}
                                    >
                                        Learn More →
                                    </Link>
                                </div>
                            </div>
                        )) : (
                            <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '3rem' }}>
                                <p>No artefacts found in this category.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* CTA Section */}
                <div style={{
                    marginTop: '5rem',
                    backgroundColor: '#5a4a3a',
                    borderRadius: '16px',
                    padding: '4rem',
                    textAlign: 'center',
                    color: '#ffffff'
                }}>
                    <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: '300',
                        marginBottom: '1rem'
                    }}>
                        Have an artefact to <span style={{ fontWeight: '600' }}>contribute?</span>
                    </h2>
                    <p style={{
                        fontSize: '1.1rem',
                        marginBottom: '2rem',
                        opacity: 0.9
                    }}>
                        Help us preserve our cultural heritage by sharing your collection
                    </p>
                    <Link to="/contribute">
                        <button style={{
                            backgroundColor: '#c9a87c',
                            color: '#ffffff',
                            padding: '1rem 3rem',
                            fontSize: '1rem',
                            fontWeight: '600',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}>
                            Submit Your Artefact
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}