import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Home() {

    const navigate = useNavigate();
    
    return (
        <div style={{
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            backgroundColor: '#f5f1ed',
            minHeight: '100vh'
        }}>
            <Navbar />
            
            {/* Hero Section */}
            <section style={{
                position: 'relative',
                height: '600px',
                margin: '2rem auto',
                maxWidth: '1400px',
                borderRadius: '24px',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #8b6f47 0%, #5a4a3a 100%)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
            }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'url("/assets/homepage.png") center/cover',
                    opacity: 0.4
                }}></div>
                
                <div style={{
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '0 4rem',
                    color: '#ffffff'
                }}>
                    <h1 style={{
                        fontSize: '3.5rem',
                        fontWeight: '300',
                        lineHeight: '1.2',
                        marginBottom: '1rem',
                        maxWidth: '600px'
                    }}>
                        Preserving <span style={{ fontWeight: '600' }}>Cultural Heritage</span><br />
                        Through Technology
                    </h1>
                    
                    <p style={{
                        fontSize: '1.1rem',
                        maxWidth: '500px',
                        marginBottom: '2rem',
                        opacity: 0.95,
                        lineHeight: '1.6'
                    }}>
                        Explore and classify Kikuyu artefacts with our AI-powered tool. 
                        Discover the rich history and traditions of Gĩkũyũ culture.
                    </p>
                    
                    <button 
                        onClick={() => navigate('/classify')} // Redirect logic added here
                        style={{
                            backgroundColor: '#c9a87c',
                            color: '#2c2420',
                            padding: '1rem 2.5rem',
                            // ... other styles ...
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#d4b890';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#c9a87c';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        Start Your Heritage Journey
                    </button>
                </div>
            </section>

            {/* Stats & Info Section */}
            <section style={{
                maxWidth: '1400px',
                margin: '4rem auto',
                padding: '0 2rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem'
            }}>
                <div style={{
                    backgroundColor: '#c9a87c',
                    borderRadius: '16px',
                    padding: '3rem',
                    color: '#2c2420',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        borderRadius: '50%',
                        marginBottom: '2rem'
                    }}></div>
                    <h2 style={{
                        fontSize: '3rem',
                        fontWeight: '300',
                        marginBottom: '0.5rem'
                    }}>150+</h2>
                    <p style={{
                        fontSize: '0.95rem',
                        opacity: 0.9,
                        fontWeight: '500'
                    }}>
                        Artefacts Catalogued<br />
                        <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>Years of Heritage</span>
                    </p>
                </div>

                <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    padding: '3rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <h3 style={{
                        fontSize: '1.8rem',
                        fontWeight: '400',
                        marginBottom: '1rem',
                        color: '#2c2420'
                    }}>
                        Who <span style={{ fontWeight: '600' }}>We Are</span>
                    </h3>
                    <p style={{
                        color: '#5a4a3a',
                        lineHeight: '1.7',
                        fontSize: '0.95rem'
                    }}>
                        At Ūgwati wa Gĩkũyũ, we understand the challenge of 
                        preserving exceptional cultural heritage. Our AI-powered 
                        platform bridges tradition and technology.
                    </p>
                </div>

                <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
                }}>
                    <div style={{
                        height: '100%',
                        background: 'url("https://images.unsplash.com/photo-1610296669228-602fa827fc1f?w=600") center/cover'
                    }}></div>
                </div>
            </section>

            {/* How We Simplify Section */}
            <section style={{
                maxWidth: '1400px',
                margin: '6rem auto 4rem',
                padding: '0 2rem'
            }}>
                <h2 style={{
                    fontSize: '2.5rem',
                    fontWeight: '400',
                    marginBottom: '3rem',
                    color: '#2c2420'
                }}>
                    How We <span style={{ fontWeight: '600', color: '#c9a87c' }}>Simplify</span> Your<br />
                    Heritage Experience
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.5fr',
                    gap: '2rem',
                    alignItems: 'center'
                }}>
                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        padding: '3rem',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
                    }}>
                        <div style={{
                            fontSize: '6rem',
                            fontWeight: '200',
                            color: '#f0e8e0',
                            marginBottom: '1rem'
                        }}>5</div>
                        <h3 style={{
                            fontSize: '1.5rem',
                            fontWeight: '400',
                            marginBottom: '1rem',
                            color: '#2c2420'
                        }}>
                            AI-Powered <span style={{ fontWeight: '600' }}>Classification</span>
                        </h3>
                        <p style={{
                            color: '#5a4a3a',
                            lineHeight: '1.7',
                            fontSize: '0.95rem'
                        }}>
                            Our commitment to your understanding extends beyond the first 
                            interaction. We provide thorough analysis to ensure your artefacts 
                            are properly identified and catalogued.
                        </p>
                    </div>

                    <div style={{
                        borderRadius: '16px',
                        overflow: 'hidden',
                        height: '400px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{
                            height: '100%',
                            background: 'url("https://images.unsplash.com/photo-1578926078627-46a7b18977e3?w=800") center/cover'
                        }}></div>
                    </div>
                </div>
            </section>

            {/* Why Choose Section */}
            <section style={{
                maxWidth: '1400px',
                margin: '6rem auto 4rem',
                padding: '0 2rem'
            }}>
                <h2 style={{
                    fontSize: '2.5rem',
                    fontWeight: '400',
                    marginBottom: '3rem',
                    color: '#2c2420'
                }}>
                    Why <span style={{ fontWeight: '600', color: '#c9a87c' }}>Choose</span> Ūgwati wa Gĩkũyũ
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '2rem'
                }}>
                    <div style={{
                        backgroundColor: '#e8dfd5',
                        borderRadius: '16px',
                        padding: '2.5rem',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            backgroundColor: 'rgba(139, 111, 71, 0.2)',
                            borderRadius: '50%',
                            margin: '0 auto 1.5rem'
                        }}></div>
                        <h3 style={{
                            fontSize: '1.3rem',
                            fontWeight: '600',
                            marginBottom: '0.8rem',
                            color: '#2c2420'
                        }}>Comprehensive Database</h3>
                        <p style={{
                            color: '#5a4a3a',
                            lineHeight: '1.6',
                            fontSize: '0.9rem'
                        }}>
                            Access our extensive collection of Kikuyu cultural artefacts 
                            and historical records.
                        </p>
                    </div>

                    <div style={{
                        backgroundColor: '#5a4a3a',
                        borderRadius: '16px',
                        padding: '2.5rem',
                        textAlign: 'center',
                        color: '#ffffff'
                    }}>
                        <h3 style={{
                            fontSize: '1.3rem',
                            fontWeight: '600',
                            marginBottom: '0.8rem'
                        }}>Advanced AI Recognition</h3>
                        <p style={{
                            opacity: 0.9,
                            lineHeight: '1.6',
                            fontSize: '0.9rem'
                        }}>
                            We use state-of-the-art AI technology to accurately 
                            identify and classify cultural items with precision.
                        </p>
                    </div>

                    <div style={{
                        backgroundColor: '#3a2f28',
                        borderRadius: '16px',
                        padding: '2.5rem',
                        textAlign: 'center',
                        color: '#ffffff'
                    }}>
                        <h3 style={{
                            fontSize: '1.3rem',
                            fontWeight: '600',
                            marginBottom: '0.8rem'
                        }}>Cultural Preservation</h3>
                        <p style={{
                            opacity: 0.9,
                            lineHeight: '1.6',
                            fontSize: '0.9rem'
                        }}>
                            We specialize in helping communities preserve their 
                            heritage for future generations through digital archiving.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}