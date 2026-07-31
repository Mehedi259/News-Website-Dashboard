'use client';
import { useRef, useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { fetchAPI } from '@/lib/api';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function CategoriesPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await fetchAPI('/categories');
      if (res.success) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name || !slug) return alert('Name and slug are required');
    
    // Format slug to replace spaces with hyphens (Django slug validation)
    const formattedSlug = slug.trim().replace(/\s+/g, '-').toLowerCase();
    
    setSaving(true);
    try {
      if (editId) {
        const res = await fetchAPI(`/categories/${editId}`, {
          method: 'PUT',
          data: { name, slug: formattedSlug }
        });
        if (res.success) {
          setCategories(categories.map(c => c._id === editId ? res.data : c));
          setName('');
          setSlug('');
          setEditId(null);
        }
      } else {
        const res = await fetchAPI('/categories', {
          data: { name, slug: formattedSlug }
        });
        if (res.success) {
          setCategories([...categories, res.data]);
          setName('');
          setSlug('');
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await fetchAPI(`/categories/${id}`, { method: 'DELETE' });
      setCategories(categories.filter(c => c._id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete category');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>Manage Categories</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Add, edit, or delete news categories.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditId(null); setName(''); setSlug(''); inputRef.current?.focus(); }}>
          <Plus size={18} />
          Add Category
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            {editId ? 'Edit Category' : 'Add New Category'}
          </h3>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Category Name</label>
              <input 
                ref={inputRef} 
                type="text" 
                className="input-field" 
                placeholder="e.g. Technology" 
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Slug</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. technology" 
                value={slug}
                onChange={e => setSlug(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%' }} disabled={saving}>
              {saving ? 'Saving...' : editId ? 'Update Category' : 'Save Category'}
            </button>
            {editId && (
              <button type="button" className="btn btn-secondary" style={{ width: '100%' }} onClick={() => { setEditId(null); setName(''); setSlug(''); }}>
                Cancel
              </button>
            )}
          </form>
        </div>

        <div className="card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={3} style={{ textAlign: 'center', padding: '1rem' }}>Loading...</td></tr>
                ) : categories.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: 'center', padding: '1rem' }}>No categories found.</td></tr>
                ) : (
                  categories.map(cat => (
                    <tr key={cat._id}>
                      <td><strong>{cat.name}</strong></td>
                      <td>{cat.slug}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => { setEditId(cat._id); setName(cat.name); setSlug(cat.slug); inputRef.current?.focus(); }} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card-hover)', color: 'var(--text-secondary)', cursor: 'pointer', border: 'none' }}>
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(cat._id)} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', cursor: 'pointer', border: 'none' }}>
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
    </div>
  );
}
