import { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 992); // Sidebar breaks earlier
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const API_BASE = import.meta.env.VITE_API_URL;
        try {
            const response = await fetch(`${API_BASE}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                setFormData({ name: '', email: '', subject: '', message: '' });
                setSubmitted(true);
            } else {
                alert('Error submitting form');
            }
        } catch (error) {
            alert('Could not reach the server.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#f5f1ed', minHeight: '100vh' }}>
            <Navbar />
            
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '2rem 1rem' : '4rem 2rem' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: isMobile ? '2rem' : '4rem' }}>
                    <h1 style={{ fontSize: isMobile ? '2.2rem' : '3.5rem', fontWeight: '300', color: '#2c2420', marginBottom: '1rem' }}>
                        Get In <span style={{ fontWeight: '600', color: '#c9a87c' }}>Touch</span>
                    </h1>
                    <p style={{ fontSize: isMobile ? '1rem' : '1.2rem', color: '#5a4a3a', maxWidth: '600px', margin: '0 auto' }}>
                        Have questions? Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                {/* Main Content Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr',
                    gap: isMobile ? '1.5rem' : '3rem',
                    marginBottom: '4rem'
                }}>
                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        padding: isMobile ? '1.5rem' : '3rem',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
                    }}>
                        {submitted ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <h2>Message Sent!</h2>
                                <button onClick={() => setSubmitted(false)} style={{ backgroundColor: '#c9a87c', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', marginTop: '1rem' }}>Send another</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Send a <span style={{ color: '#c9a87c' }}>Message</span></h2>
                                {['name', 'email'].map((field) => (
                                    <div key={field} style={{ marginBottom: '1rem' }}>
                                        <input
                                            type={field === 'email' ? 'email' : 'text'}
                                            name={field}
                                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                            value={(formData as any)[field]}
                                            onChange={handleChange}
                                            required
                                            style={{ width: '100%', padding: '0.8rem', border: '2px solid #e8dfd5', borderRadius: '8px' }}
                                        />
                                    </div>
                                ))}
                                <select name="subject" value={formData.subject} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', border: '2px solid #e8dfd5', borderRadius: '8px' }}>
                                    <option value="">Select Subject</option>
                                    <option value="GENERAL">General Inquiry</option>
                                </select>
                                <textarea name="message" value={formData.message} onChange={handleChange} required rows={5} style={{ width: '100%', padding: '0.8rem', border: '2px solid #e8dfd5', borderRadius: '8px', marginBottom: '1rem' }} placeholder="Message" />
                                <button type="submit" disabled={isSubmitting} style={{ width: '100%', backgroundColor: '#c9a87c', color: '#fff', padding: '1rem', border: 'none', borderRadius: '8px', fontWeight: '600' }}>
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ backgroundColor: '#5a4a3a', borderRadius: '16px', padding: '1.5rem', color: '#fff' }}>
                            <h3 style={{ fontSize: '1.1rem' }}>Email Us</h3>
                            <p style={{ fontSize: '0.9rem' }}>info@ugwatigikuyu.com</p>
                        </div>
                        <div style={{ backgroundColor: '#c9a87c', borderRadius: '16px', padding: '1.5rem', color: '#fff' }}>
                            <h3 style={{ fontSize: '1.1rem' }}>Call Us</h3>
                            <p style={{ fontSize: '0.9rem' }}>+254 700 000 000</p>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: isMobile ? '1.5rem' : '3rem', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>FAQs</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
                        {[{ q: 'How accurate?', a: '95%+ accuracy.' }, { q: 'Free?', a: 'Basic is free.' }].map((faq, idx) => (
                            <div key={idx} style={{ padding: '1rem', backgroundColor: '#faf8f5', borderRadius: '12px', borderLeft: '4px solid #c9a87c' }}>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>{faq.q}</h4>
                                <p style={{ fontSize: '0.85rem' }}>{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}