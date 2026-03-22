import Navbar from "../components/Navbar";

export default function Heritage() {
    const artefacts = [
        {
            name: 'Kĩondo (Traditional Basket)',
            category: 'Household Items',
            era: '18th-19th Century',
            image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400'
        },
        {
            name: 'Mũthĩgi (Wooden Stool)',
            category: 'Furniture',
            era: 'Pre-Colonial',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
        },
        {
            name: 'Njugũ (Neck Ornament)',
            category: 'Jewelry',
            era: '19th Century',
            image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=400'
        },
        {
            name: 'Mũkwa (Clay Pot)',
            category: 'Pottery',
            era: 'Traditional',
            image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400'
        },
        {
            name: 'Rũthanju (War Shield)',
            category: 'Weapons',
            era: 'Warrior Era',
            image: 'https://images.unsplash.com/photo-1610296669228-602fa827fc1f?w=400'
        },
        {
            name: 'Ngũcũ (Anklet)',
            category: 'Jewelry',
            era: '19th Century',
            image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400'
        }
    ];

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
                    {['All', 'Household', 'Jewelry', 'Weapons', 'Pottery', 'Furniture'].map((category) => (
                        <button
                            key={category}
                            style={{
                                padding: '0.7rem 1.8rem',
                                border: '2px solid #c9a87c',
                                backgroundColor: category === 'All' ? '#c9a87c' : 'transparent',
                                color: category === 'All' ? '#ffffff' : '#5a4a3a',
                                borderRadius: '8px',
                                fontSize: '0.95rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#c9a87c';
                                e.currentTarget.style.color = '#ffffff';
                            }}
                            onMouseLeave={(e) => {
                                if (category !== 'All') {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = '#5a4a3a';
                                }
                            }}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Artefacts Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '2rem'
                }}>
                    {artefacts.map((item, idx) => (
                        <div
                            key={idx}
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
                                background: `url("${item.image}") center/cover`,
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
                                    fontSize: '0.8rem',
                                    fontWeight: '600'
                                }}>
                                    {item.category}
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
                                <button style={{
                                    color: '#c9a87c',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    padding: 0
                                }}>
                                    Learn More →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

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
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#d4b890';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#c9a87c';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}>
                        Submit Your Artefact
                    </button>
                </div>
            </div>
        </div>
    );
}