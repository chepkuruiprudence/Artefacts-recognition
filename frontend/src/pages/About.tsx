import Navbar from "../components/Navbar";

export default function About() {
    return (
        <div style={{
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            backgroundColor: '#f5f1ed',
            minHeight: '100vh'
        }}>
            <Navbar />
            
            {/* Hero Section */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '5rem 2rem 3rem'
            }}>
                <div style={{
                    textAlign: 'center',
                    marginBottom: '5rem'
                }}>
                    <h1 style={{
                        fontSize: '3.5rem',
                        fontWeight: '300',
                        color: '#2c2420',
                        marginBottom: '1.5rem'
                    }}>
                        About <span style={{ fontWeight: '600', color: '#c9a87c' }}>Ūgwati wa Gĩkũyũ</span>
                    </h1>
                    <p style={{
                        fontSize: '1.2rem',
                        color: '#5a4a3a',
                        maxWidth: '700px',
                        margin: '0 auto',
                        lineHeight: '1.8'
                    }}>
                        Preserving the rich cultural heritage of the Kikuyu people through 
                        modern technology and artificial intelligence
                    </p>
                </div>

                {/* Mission & Vision */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '2rem',
                    marginBottom: '5rem'
                }}>
                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        padding: '3rem',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            backgroundColor: '#c9a87c',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            marginBottom: '1.5rem'
                        }}>🎯</div>
                        <h2 style={{
                            fontSize: '1.8rem',
                            fontWeight: '600',
                            color: '#2c2420',
                            marginBottom: '1rem'
                        }}>Our Mission</h2>
                        <p style={{
                            color: '#5a4a3a',
                            lineHeight: '1.8',
                            fontSize: '1rem'
                        }}>
                            To digitally preserve and celebrate Kikuyu cultural artefacts, 
                            making them accessible to current and future generations through 
                            innovative AI-powered classification and education.
                        </p>
                    </div>

                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        padding: '3rem',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            backgroundColor: '#5a4a3a',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            marginBottom: '1.5rem'
                        }}>👁️</div>
                        <h2 style={{
                            fontSize: '1.8rem',
                            fontWeight: '600',
                            color: '#2c2420',
                            marginBottom: '1rem'
                        }}>Our Vision</h2>
                        <p style={{
                            color: '#5a4a3a',
                            lineHeight: '1.8',
                            fontSize: '1rem'
                        }}>
                            A world where cultural heritage is preserved, understood, and 
                            celebrated through the seamless integration of tradition and 
                            cutting-edge technology.
                        </p>
                    </div>
                </div>

                {/* Story Section */}
                <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    padding: '4rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    marginBottom: '5rem'
                }}>
                    <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: '400',
                        color: '#2c2420',
                        marginBottom: '2rem',
                        textAlign: 'center'
                    }}>
                        Our <span style={{ fontWeight: '600', color: '#c9a87c' }}>Story</span>
                    </h2>
                    <div style={{
                        maxWidth: '800px',
                        margin: '0 auto',
                        color: '#5a4a3a',
                        lineHeight: '1.9',
                        fontSize: '1.05rem'
                    }}>
                        <p style={{ marginBottom: '1.5rem' }}>
                            Ūgwati wa Gĩkũyũ was born from a simple observation: many cultural 
                            artefacts and their stories were being lost to time. Younger generations 
                            were disconnected from the rich heritage of their ancestors, and physical 
                            collections were scattered across museums and private collections.
                        </p>
                        <p style={{ marginBottom: '1.5rem' }}>
                            We recognized that technology could bridge this gap. By combining 
                            artificial intelligence with deep cultural knowledge, we created a 
                            platform that makes it easy for anyone to identify, learn about, and 
                            appreciate Kikuyu cultural artefacts.
                        </p>
                        <p>
                            Today, we're proud to serve as a digital guardian of Kikuyu heritage, 
                            helping preserve these precious pieces of history for generations to come.
                        </p>
                    </div>
                </div>

                {/* Values */}
                <div style={{ marginBottom: '5rem' }}>
                    <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: '400',
                        color: '#2c2420',
                        marginBottom: '3rem',
                        textAlign: 'center'
                    }}>
                        Our <span style={{ fontWeight: '600', color: '#c9a87c' }}>Values</span>
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '2rem'
                    }}>
                        {[
                            {
                                icon: '🏛️',
                                title: 'Cultural Respect',
                                desc: 'We honor the traditions and wisdom of Kikuyu ancestors in everything we do'
                            },
                            {
                                icon: '🔬',
                                title: 'Innovation',
                                desc: 'We leverage cutting-edge AI to make heritage accessible and engaging'
                            },
                            {
                                icon: '🌍',
                                title: 'Accessibility',
                                desc: 'Cultural knowledge should be available to everyone, everywhere'
                            },
                            {
                                icon: '🤝',
                                title: 'Community',
                                desc: 'We build together with elders, experts, and enthusiasts'
                            },
                            {
                                icon: '📚',
                                title: 'Education',
                                desc: 'Knowledge sharing is at the heart of cultural preservation'
                            },
                            {
                                icon: '✨',
                                title: 'Excellence',
                                desc: 'We strive for accuracy and quality in every classification'
                            }
                        ].map((value, idx) => (
                            <div
                                key={idx}
                                style={{
                                    backgroundColor: '#ffffff',
                                    borderRadius: '16px',
                                    padding: '2.5rem',
                                    textAlign: 'center',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                                    transition: 'transform 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <div style={{
                                    fontSize: '3rem',
                                    marginBottom: '1rem'
                                }}>{value.icon}</div>
                                <h3 style={{
                                    fontSize: '1.3rem',
                                    fontWeight: '600',
                                    color: '#2c2420',
                                    marginBottom: '0.8rem'
                                }}>{value.title}</h3>
                                <p style={{
                                    color: '#5a4a3a',
                                    lineHeight: '1.6',
                                    fontSize: '0.95rem'
                                }}>{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div style={{
                    backgroundColor: '#c9a87c',
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
                        Join Our <span style={{ fontWeight: '600' }}>Journey</span>
                    </h2>
                    <p style={{
                        fontSize: '1.1rem',
                        marginBottom: '2rem',
                        opacity: 0.95,
                        maxWidth: '600px',
                        margin: '0 auto 2rem'
                    }}>
                        Whether you're a researcher, educator, or simply curious about 
                        Kikuyu culture, we invite you to explore and contribute
                    </p>
                    <button style={{
                        backgroundColor: '#ffffff',
                        color: '#c9a87c',
                        padding: '1rem 3rem',
                        fontSize: '1rem',
                        fontWeight: '600',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f5f1ed';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}>
                        Get Started Today
                    </button>
                </div>
            </div>
        </div>
    );
}