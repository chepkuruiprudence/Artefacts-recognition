import { useState } from 'react';
import Navbar from "../components/Navbar";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            alert('Thank you! We will get back to you soon.');
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div style={{
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            backgroundColor: '#f5f1ed',
            minHeight: '100vh'
        }}>
            <Navbar />
            
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '4rem 2rem'
            }}>
                {/* Header */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '4rem'
                }}>
                    <h1 style={{
                        fontSize: '3.5rem',
                        fontWeight: '300',
                        color: '#2c2420',
                        marginBottom: '1rem'
                    }}>
                        Get In <span style={{ fontWeight: '600', color: '#c9a87c' }}>Touch</span>
                    </h1>
                    <p style={{
                        fontSize: '1.2rem',
                        color: '#5a4a3a',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                {/* Main Content Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr',
                    gap: '3rem',
                    marginBottom: '4rem'
                }}>
                    {/* Contact Form */}
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
                            marginBottom: '2rem'
                        }}>
                            Send us a <span style={{ fontWeight: '600', color: '#c9a87c' }}>Message</span>
                        </h2>

                        <form onSubmit={handleSubmit}>
                            {/* Name Field */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    color: '#2c2420',
                                    fontWeight: '500',
                                    fontSize: '0.95rem'
                                }}>
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        border: '2px solid #e8dfd5',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        fontFamily: 'inherit',
                                        transition: 'border-color 0.3s ease',
                                        outline: 'none'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#c9a87c'}
                                    onBlur={(e) => e.target.style.borderColor = '#e8dfd5'}
                                    placeholder="Enter your full name"
                                />
                            </div>

                            {/* Email Field */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    color: '#2c2420',
                                    fontWeight: '500',
                                    fontSize: '0.95rem'
                                }}>
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        border: '2px solid #e8dfd5',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        fontFamily: 'inherit',
                                        transition: 'border-color 0.3s ease',
                                        outline: 'none'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#c9a87c'}
                                    onBlur={(e) => e.target.style.borderColor = '#e8dfd5'}
                                    placeholder="your.email@example.com"
                                />
                            </div>

                            {/* Subject Field */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    color: '#2c2420',
                                    fontWeight: '500',
                                    fontSize: '0.95rem'
                                }}>
                                    Subject *
                                </label>
                                <select
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        border: '2px solid #e8dfd5',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        fontFamily: 'inherit',
                                        transition: 'border-color 0.3s ease',
                                        outline: 'none',
                                        backgroundColor: '#ffffff',
                                        cursor: 'pointer'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#c9a87c'}
                                    onBlur={(e) => e.target.style.borderColor = '#e8dfd5'}
                                >
                                    <option value="">Select a subject</option>
                                    <option value="general">General Inquiry</option>
                                    <option value="classification">Artefact Classification</option>
                                    <option value="contribution">Contribute an Artefact</option>
                                    <option value="partnership">Partnership Opportunity</option>
                                    <option value="technical">Technical Support</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* Message Field */}
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    color: '#2c2420',
                                    fontWeight: '500',
                                    fontSize: '0.95rem'
                                }}>
                                    Message *
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        border: '2px solid #e8dfd5',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        fontFamily: 'inherit',
                                        transition: 'border-color 0.3s ease',
                                        outline: 'none',
                                        resize: 'vertical'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#c9a87c'}
                                    onBlur={(e) => e.target.style.borderColor = '#e8dfd5'}
                                    placeholder="Tell us how we can help you..."
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                style={{
                                    width: '100%',
                                    backgroundColor: '#c9a87c',
                                    color: '#ffffff',
                                    padding: '1.2rem',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    opacity: isSubmitting ? 0.7 : 1
                                }}
                                onMouseEnter={(e) => {
                                    if (!isSubmitting) {
                                        e.currentTarget.style.backgroundColor = '#d4b890';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#c9a87c';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>

                    {/* Contact Info Sidebar */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2rem'
                    }}>
                        {/* Contact Cards */}
                        <div style={{
                            backgroundColor: '#5a4a3a',
                            borderRadius: '16px',
                            padding: '2.5rem',
                            color: '#ffffff'
                        }}>
                            <div style={{
                                fontSize: '2.5rem',
                                marginBottom: '1rem'
                            }}>📧</div>
                            <h3 style={{
                                fontSize: '1.3rem',
                                fontWeight: '600',
                                marginBottom: '0.8rem'
                            }}>Email Us</h3>
                            <p style={{
                                opacity: 0.9,
                                lineHeight: '1.6',
                                fontSize: '0.95rem',
                                marginBottom: '0.5rem'
                            }}>
                                info@ugwatigikuyu.com
                            </p>
                            <p style={{
                                opacity: 0.9,
                                lineHeight: '1.6',
                                fontSize: '0.95rem'
                            }}>
                                support@ugwatigikuyu.com
                            </p>
                        </div>

                        <div style={{
                            backgroundColor: '#c9a87c',
                            borderRadius: '16px',
                            padding: '2.5rem',
                            color: '#ffffff'
                        }}>
                            <div style={{
                                fontSize: '2.5rem',
                                marginBottom: '1rem'
                            }}>📞</div>
                            <h3 style={{
                                fontSize: '1.3rem',
                                fontWeight: '600',
                                marginBottom: '0.8rem'
                            }}>Call Us</h3>
                            <p style={{
                                opacity: 0.95,
                                lineHeight: '1.6',
                                fontSize: '0.95rem',
                                marginBottom: '0.5rem'
                            }}>
                                +254 700 000 000
                            </p>
                            <p style={{
                                opacity: 0.8,
                                fontSize: '0.85rem'
                            }}>
                                Mon-Fri: 9AM - 6PM EAT
                            </p>
                        </div>

                        <div style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '16px',
                            padding: '2.5rem',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
                        }}>
                            <div style={{
                                fontSize: '2.5rem',
                                marginBottom: '1rem'
                            }}>📍</div>
                            <h3 style={{
                                fontSize: '1.3rem',
                                fontWeight: '600',
                                color: '#2c2420',
                                marginBottom: '0.8rem'
                            }}>Visit Us</h3>
                            <p style={{
                                color: '#5a4a3a',
                                lineHeight: '1.6',
                                fontSize: '0.95rem'
                            }}>
                                Nairobi, Kenya<br />
                                Cultural Heritage Center<br />
                                Kimathi Street
                            </p>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
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
                        Frequently Asked <span style={{ fontWeight: '600', color: '#c9a87c' }}>Questions</span>
                    </h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '2rem'
                    }}>
                        {[
                            {
                                q: 'How accurate is the AI classification?',
                                a: 'Our AI has been trained on thousands of artefacts with 95%+ accuracy rate.'
                            },
                            {
                                q: 'Can I contribute my artefacts?',
                                a: 'Yes! We welcome contributions from community members and collectors.'
                            },
                            {
                                q: 'Is the service free to use?',
                                a: 'Basic classification is free. Premium features available for researchers.'
                            },
                            {
                                q: 'How long does classification take?',
                                a: 'Most classifications are completed within seconds of uploading.'
                            }
                        ].map((faq, idx) => (
                            <div key={idx} style={{
                                padding: '1.5rem',
                                backgroundColor: '#faf8f5',
                                borderRadius: '12px',
                                borderLeft: '4px solid #c9a87c'
                            }}>
                                <h4 style={{
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    color: '#2c2420',
                                    marginBottom: '0.7rem'
                                }}>{faq.q}</h4>
                                <p style={{
                                    color: '#5a4a3a',
                                    fontSize: '0.95rem',
                                    lineHeight: '1.6'
                                }}>{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Social Media */}
                <div style={{
                    marginTop: '4rem',
                    textAlign: 'center'
                }}>
                    <h3 style={{
                        fontSize: '1.5rem',
                        fontWeight: '400',
                        color: '#2c2420',
                        marginBottom: '1.5rem'
                    }}>
                        Follow Our <span style={{ fontWeight: '600', color: '#c9a87c' }}>Journey</span>
                    </h3>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '1.5rem'
                    }}>
                        {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((platform) => (
                            <a
                                key={platform}
                                href="#"
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    backgroundColor: '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textDecoration: 'none',
                                    color: '#c9a87c',
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#c9a87c';
                                    e.currentTarget.style.color = '#ffffff';
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#ffffff';
                                    e.currentTarget.style.color = '#c9a87c';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                {platform.slice(0, 2)}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}