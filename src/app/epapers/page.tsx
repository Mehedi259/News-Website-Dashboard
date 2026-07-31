'use client';
import { useRef, useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { fetchAPI } from '@/lib/api';

interface EPaper {
  _id: string;
  title: string;
  date: string;
  pdf_url: string;
  thumbnail: string;
}

export default function EPapersPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [epapers, setEpapers] = useState<EPaper[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    loadEpapers();
  }, []);

  const loadEpapers = async () => {
    try {
      const res = await fetchAPI('/epapers');
      if (res.success) {
        setEpapers(res.data);
      }
    } catch (err) {
      console.error('Failed to load epapers', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title || !date || !pdfUrl) return alert('টাইটেল, তারিখ এবং পিডিএফ ইউআরএল দেওয়া বাধ্যতামূলক');
    
    setSaving(true);
    try {
      const data = { title, date, pdf_url: pdfUrl, thumbnail };
      if (editId) {
        const res = await fetchAPI(`/epapers/${editId}`, {
          method: 'PUT',
          data
        });
        if (res.success) {
          setEpapers(epapers.map(e => e._id === editId ? res.data : e));
          resetForm();
        }
      } else {
        const res = await fetchAPI('/epapers', {
          data
        });
        if (res.success) {
          setEpapers([res.data, ...epapers]);
          resetForm();
        }
      }
    } catch (err) {
      console.error('Failed to save epaper', err);
      alert('ই-পেপার সেভ করতে সমস্যা হয়েছে');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDate('');
    setPdfUrl('');
    setThumbnail('');
    setEditId(null);
  };

  const handleEdit = (epaper: EPaper) => {
    setEditId(epaper._id);
    setTitle(epaper.title);
    setDate(epaper.date);
    setPdfUrl(epaper.pdf_url);
    setThumbnail(epaper.thumbnail || '');
    inputRef.current?.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই ই-পেপারটি মুছে ফেলতে চান?')) return;
    
    try {
      const res = await fetchAPI(`/epapers/${id}`, { method: 'DELETE' });
      if (res.success) {
        setEpapers(epapers.filter(e => e._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete epaper', err);
      alert('ই-পেপার ডিলিট করতে সমস্যা হয়েছে');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '0 0 0.25rem 0' }}>ই-পেপার</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>ওয়েবসাইটের ই-পেপারগুলো ম্যানেজ করুন</p>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>{editId ? 'ই-পেপার আপডেট করুন' : 'নতুন ই-পেপার যোগ করুন'}</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>টাইটেল *</label>
            <input 
              ref={inputRef}
              type="text" 
              className="input" 
              placeholder="ই-পেপার টাইটেল" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>তারিখ (YYYY-MM-DD) *</label>
            <input 
              type="date" 
              className="input" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>পিডিএফ ইউআরএল (PDF URL) *</label>
            <input 
              type="text" 
              className="input" 
              placeholder="পিডিএফ এর লিংক" 
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>থাম্বনেইল ইউআরএল</label>
            <input 
              type="text" 
              className="input" 
              placeholder="থাম্বনেইল ছবির লিংক" 
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          {editId && (
            <button 
              className="btn btn-secondary"
              onClick={resetForm}
              disabled={saving}
            >
              বাতিল করুন
            </button>
          )}
          <button 
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving || !title || !date || !pdfUrl}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={18} />
            {saving ? 'সেভ হচ্ছে...' : (editId ? 'আপডেট করুন' : 'যোগ করুন')}
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>সব ই-পেপার</h2>
        </div>
        
        <div className="tableContainer">
          <table className="table">
            <thead>
              <tr>
                <th>টাইটেল</th>
                <th>তারিখ</th>
                <th>পিডিএফ লিংক</th>
                <th style={{ textAlign: 'right' }}>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>লোড হচ্ছে...</td>
                </tr>
              ) : epapers.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    কোনো ই-পেপার পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                epapers.map(epaper => (
                  <tr key={epaper._id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{epaper.title}</div>
                    </td>
                    <td>{epaper.date}</td>
                    <td><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{epaper.pdf_url.substring(0, 40)}{epaper.pdf_url.length > 40 ? '...' : ''}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button 
                          className="actionBtn edit" 
                          aria-label="Edit"
                          onClick={() => handleEdit(epaper)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="actionBtn delete" 
                          aria-label="Delete"
                          onClick={() => handleDelete(epaper._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
