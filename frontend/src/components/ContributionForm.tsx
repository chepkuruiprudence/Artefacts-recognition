// components/ContributionForm.tsx
import React, { useState } from 'react';

const CATEGORIES = [
    'KIKUYU_SPEARS', 'KIKUYU_STOOLS', 'KIKUYU_BEADWORK', 
    'KIKUYU_WALKING_STICK', 'KIKUYU_POTS', 'KIKUYU_HUTS', 
    'KIKUYU_COMBS', 'KIKUYU_SHIELDS', 'KIKUYU_CALABASH'
];

export default function ContributionForm() {
    const [formData, setFormData] = useState({
        name: '',
        category: 'KIKUYU_POTS',
        era: '',
        description: '',
        culturalSignificance: '',
        materials: '',
    });
    const [images, setImages] = useState<FileList | null>(null);
    const [status, setStatus] = useState<{type: 'success' | 'error', msg: string} | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);

        // Using FormData to handle image uploads
        const data = new FormData();
        data.append('name', formData.name);
        data.append('category', formData.category);
        data.append('era', formData.era);
        data.append('description', formData.description);
        data.append('culturalSignificance', formData.culturalSignificance);
        
        // Convert comma-separated string to array for Prisma
        const materialsArray = formData.materials.split(',').map(m => m.trim());
        data.append('materials', JSON.stringify(materialsArray));

        if (images) {
            for (let i = 0; i < images.length; i++) {
                data.append('images', images[i]);
            }
        }

        const API_BASE = import.meta.env.VITE_API_URL;

        try {
            const response = await fetch(`${API_BASE}/artefacts`, {
                method: 'POST',
                body: data,
            });

            if (response.ok) {
                setStatus({ type: 'success', msg: 'Artefact submitted for review!' });
                setFormData({ name: '', category: 'KIKUYU_POTS', era: '', description: '', culturalSignificance: '', materials: '' });
            } else {
                throw new Error('Failed to submit');
            }
        } catch (err) {
            setStatus({ type: 'error', msg: 'Something went wrong. Please try again.' });
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '0.8rem',
        marginBottom: '1rem',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '1rem'
    };

    return (
        <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <h2 style={{ color: '#5a4a3a', marginBottom: '1.5rem' }}>Artefact Details</h2>
            
            <label>Artefact Name</label>
            <input 
                style={inputStyle} 
                placeholder="e.g. Traditional Kĩondo" 
                required 
                onChange={e => setFormData({...formData, name: e.target.value})}
                value={formData.name}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label>Category</label>
                    <select 
                        style={inputStyle} 
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat.replace('KIKUYU_', '').replace('_', ' ')}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Era</label>
                    <input 
                        style={inputStyle} 
                        placeholder="e.g. 19th Century" 
                        onChange={e => setFormData({...formData, era: e.target.value})}
                        value={formData.era}
                    />
                </div>
            </div>

            <label>Materials (comma separated)</label>
            <input 
                style={inputStyle} 
                placeholder="Sisal, Wood, Leather..." 
                onChange={e => setFormData({...formData, materials: e.target.value})}
                value={formData.materials}
            />

            <label>Description</label>
            <textarea 
                style={{ ...inputStyle, height: '100px', resize: 'vertical' }} 
                required 
                onChange={e => setFormData({...formData, description: e.target.value})}
                value={formData.description}
            />

            <label>Images</label>
            <input 
                type="file" 
                multiple 
                accept="image/*" 
                style={inputStyle} 
                onChange={e => setImages(e.target.files)}
            />

            {status && (
                <p style={{ color: status.type === 'success' ? 'green' : 'red', marginBottom: '1rem' }}>
                    {status.msg}
                </p>
            )}

            <button type="submit" style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: '#c9a87c',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
            }}>
                Submit for Verification
            </button>
        </form>
    );
}