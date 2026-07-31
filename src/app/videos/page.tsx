'use client';
import { useRef, useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { fetchAPI } from '@/lib/api';

interface Video {
  _id: string;
  title: string;
  embed_url: string;
  thumbnail: string;
  is_featured: boolean;
}

export default function VideosPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const res = await fetchAPI('/videos');
      if (res.success) {
        setVideos(res.data);
      }
    } catch (err) {
      console.error('Failed to load videos', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title || !embedUrl) return alert('টাইটেল এবং এম্বেড ইউআরএল দেওয়া বাধ্যতামূলক');
    
    setSaving(true);
    try {
      const data = { title, embed_url: embedUrl, thumbnail, is_featured: isFeatured };
      if (editId) {
        const res = await fetchAPI(`/videos/${editId}`, {
          method: 'PUT',
          data
        });
        if (res.success) {
          setVideos(videos.map(v => v._id === editId ? res.data : v));
          resetForm();
        }
      } else {
        const res = await fetchAPI('/videos', {
          data
        });
        if (res.success) {
          setVideos([res.data, ...videos]);
          resetForm();
        }
      }
    } catch (err) {
      console.error('Failed to save video', err);
      alert('ভিডিও সেভ করতে সমস্যা হয়েছে');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setEmbedUrl('');
    setThumbnail('');
    setIsFeatured(false);
    setEditId(null);
  };

  const handleEdit = (video: Video) => {
    setEditId(video._id);
    setTitle(video.title);
    setEmbedUrl(video.embed_url);
    setThumbnail(video.thumbnail || '');
    setIsFeatured(video.is_featured);
    inputRef.current?.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই ভিডিওটি মুছে ফেলতে চান?')) return;
    
    try {
      const res = await fetchAPI(`/videos/${id}`, { method: 'DELETE' });
      if (res.success) {
        setVideos(videos.filter(v => v._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete video', err);
      alert('ভিডিও ডিলিট করতে সমস্যা হয়েছে');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '0 0 0.25rem 0' }}>ভিডিও গ্যালারি</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>ওয়েবসাইটের ভিডিওগুলো ম্যানেজ করুন</p>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>{editId ? 'ভিডিও আপডেট করুন' : 'নতুন ভিডিও যোগ করুন'}</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>টাইটেল *</label>
            <input 
              ref={inputRef}
              type="text" 
              className="input" 
              placeholder="ভিডিও টাইটেল" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>এম্বেড ইউআরএল (Embed URL) *</label>
            <input 
              type="text" 
              className="input" 
              placeholder="যেমন: https://www.youtube.com/embed/..." 
              value={embedUrl}
              onChange={(e) => setEmbedUrl(e.target.value)}
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
          <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.5rem' }}>
             <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0 }}>
                <input 
                  type="checkbox" 
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>ফিচারড (Featured)?</span>
             </label>
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
            disabled={saving || !title || !embedUrl}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={18} />
            {saving ? 'সেভ হচ্ছে...' : (editId ? 'আপডেট করুন' : 'যোগ করুন')}
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>সব ভিডিও</h2>
        </div>
        
        <div className="tableContainer">
          <table className="table">
            <thead>
              <tr>
                <th>টাইটেল</th>
                <th>এম্বেড লিংক</th>
                <th>ফিচারড</th>
                <th style={{ textAlign: 'right' }}>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>লোড হচ্ছে...</td>
                </tr>
              ) : videos.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    কোনো ভিডিও পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                videos.map(video => (
                  <tr key={video._id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{video.title}</div>
                    </td>
                    <td><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{video.embed_url.substring(0, 40)}{video.embed_url.length > 40 ? '...' : ''}</span></td>
                    <td>
                      {video.is_featured ? (
                         <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>হ্যাঁ</span>
                      ) : (
                         <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>না</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button 
                          className="actionBtn edit" 
                          aria-label="Edit"
                          onClick={() => handleEdit(video)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="actionBtn delete" 
                          aria-label="Delete"
                          onClick={() => handleDelete(video._id)}
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
