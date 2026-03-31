import Navbar from "../components/Navbar";

export default function About() {
    return (
        <div style={{
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            backgroundColor: '#f5f1ed',
            minHeight: '100vh',
            width: '100%'
        }}>
            {/* Responsive CSS Logic */}
            <style>{`
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 4rem 1.5rem;
                }
                .grid-2 {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                    margin-bottom: 4rem;
                }
                .grid-3 {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 4rem;
                }
                .hero-text {
                    font-size: clamp(2rem, 8vw, 3.5rem);
                }
                .story-card {
                    padding: clamp(1.5rem, 5vw, 4rem);
                }
                @media (max-width: 768px) {
                    .container { padding-top: 2rem; }
                    .mobile-text-center { text-align: center; }
                }
            `}</style>

            <Navbar />
            
            <div className="container">
                {/* Hero Section */}
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 className="hero-text" style={{
                        fontWeight: '300',
                        color: '#2c2420',
                        marginBottom: '1.5rem',
                        lineHeight: '1.2'
                    }}>
                        About <span style={{ fontWeight: '600', color: '#c9a87c' }}>Ūgwati wa Gĩkũyũ</span>
                    </h1>
                    <p style={{
                        fontSize: '1.1rem',
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
                <div className="grid-2">
                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        padding: '2.5rem',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{
                            width: '50px', height: '50px',
                            backgroundColor: '#c9a87c',
                            borderRadius: '12px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.5rem', marginBottom: '1.5rem'
                        }}>🎯</div>
                        <h2 style={{ fontSize: '1.6rem', fontWeight: '600', color: '#2c2420', marginBottom: '1rem' }}>Our Mission</h2>
                        <p style={{ color: '#5a4a3a', lineHeight: '1.7' }}>
                            To digitally preserve and celebrate Kikuyu cultural artefacts, 
                            making them accessible to current and future generations through 
                            innovative AI-powered classification and education.
                        </p>
                    </div>

                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        padding: '2.5rem',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{
                            width: '50px', height: '50px',
                            backgroundColor: '#5a4a3a',
                            borderRadius: '12px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.5rem', marginBottom: '1.5rem'
                        }}>👁️</div>
                        <h2 style={{ fontSize: '1.6rem', fontWeight: '600', color: '#2c2420', marginBottom: '1rem' }}>Our Vision</h2>
                        <p style={{ color: '#5a4a3a', lineHeight: '1.7' }}>
                            A world where cultural heritage is preserved, understood, and 
                            celebrated through the seamless integration of tradition and 
                            cutting-edge technology.
                        </p>
                    </div>
                </div>

                {/* Story Section */}
                <div className="story-card" style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    marginBottom: '4rem'
                }}>
                    <h2 style={{
                        fontSize: '2.2rem',
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
                        fontSize: '1rem'
                    }}>
                        <p style={{ marginBottom: '1.5rem' }}>
                            Ūgwati wa Gĩkũyũ was born from a simple observation: many cultural 
                            artefacts and their stories were being lost to time. Younger generations 
                            were disconnected from the rich heritage of their ancestors.
                        </p>
                        <p style={{ marginBottom: '1.5rem' }}>
                            We recognized that technology could bridge this gap. By combining 
                            artificial intelligence with deep cultural knowledge, we created a 
                            platform that makes it easy for anyone to identify and appreciate Kikuyu history.
                        </p>
                    </div>
                </div>

                {/* Values */}
                <div style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: '400', color: '#2c2420', marginBottom: '3rem', textAlign: 'center' }}>
                        Our <span style={{ fontWeight: '600', color: '#c9a87c' }}>Values</span>
                    </h2>
                    <div className="grid-3">
                        {[
                            { icon: '🏛️', title: 'Cultural Respect', desc: 'We honor the traditions and wisdom of Kikuyu ancestors.' },
                            { icon: '🔬', title: 'Innovation', desc: 'We leverage AI to make heritage accessible and engaging.' },
                            { icon: '🌍', title: 'Accessibility', desc: 'Cultural knowledge should be available to everyone.' },
                            { icon: '🤝', title: 'Community', desc: 'We build together with elders and experts.' },
                            { icon: '📚', title: 'Education', desc: 'Knowledge sharing is at the heart of preservation.' },
                            { icon: '✨', title: 'Excellence', desc: 'We strive for accuracy in every classification.' }
                        ].map((value, idx) => (
                            <div key={idx} style={{
                                backgroundColor: '#ffffff',
                                borderRadius: '16px',
                                padding: '2rem',
                                textAlign: 'center',
                                boxShadow: '0 5px 15px rgba(0,0,0,0.04)'
                            }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{value.icon}</div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#2c2420', marginBottom: '0.8rem' }}>{value.title}</h3>
                                <p style={{ color: '#5a4a3a', lineHeight: '1.6', fontSize: '0.9rem' }}>{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div style={{
                    backgroundColor: '#c9a87c',
                    borderRadius: '16px',
                    padding: 'clamp(2rem, 8vw, 4rem)',
                    textAlign: 'center',
                    color: '#ffffff'
                }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '300', marginBottom: '1rem' }}>
                        Join Our <span style={{ fontWeight: '600' }}>Journey</span>
                    </h2>
                    <p style={{ fontSize: '1rem', marginBottom: '2rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 2rem' }}>
                        Explore and contribute to the digital preservation of Kikuyu culture.
                    </p>
                    <button style={{
                        backgroundColor: '#ffffff',
                        color: '#c9a87c',
                        padding: '1rem 2.5rem',
                        fontSize: '1rem',
                        fontWeight: '600',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}>
                        Get Started Today
                    </button>
                </div>
            </div>
        </div>
    );
}