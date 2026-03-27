// pages/Contribute.tsx
import Navbar from "../components/Navbar";
import ContributionForm from "../components/ContributionForm";

export default function Contribute() {
    return (
        <div style={{ backgroundColor: '#f5f1ed', minHeight: '100vh' }}>
            <Navbar />
            
            <div style={{
                background: 'linear-gradient(135deg, #5a4a3a 0%, #2c2420 100%)',
                color: 'white',
                padding: '4rem 2rem',
                textAlign: 'center'
            }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Contribute to the <span style={{ fontWeight: '600' }}>Archive</span></h1>
                <p style={{ maxWidth: '600px', margin: '0 auto', opacity: 0.9 }}>
                    Your contribution helps preserve the history of the Kikuyu people. 
                    Submissions are reviewed by experts before being added to the public gallery.
                </p>
            </div>

            <div style={{ maxWidth: '800px', margin: '-3rem auto 4rem', padding: '0 1rem' }}>
                <ContributionForm />
                
                <div style={{ marginTop: '2rem', textAlign: 'center', color: '#8b6f47' }}>
                    <p>💡 <strong>Tip:</strong> Clear, high-resolution photos from multiple angles help speed up the verification process.</p>
                </div>
            </div>
        </div>
    );
}