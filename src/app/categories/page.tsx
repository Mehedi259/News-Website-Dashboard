'use client';
import { useRef } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function CategoriesPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { id: 1, name: 'প্রচ্ছদ', slug: 'home', count: 120 },
    { id: 2, name: 'প্রবাস', slug: 'probash', count: 450 },
    { id: 3, name: 'সর্বশেষ', slug: 'latest', count: 85 },
    { id: 4, name: 'বাংলাদেশ', slug: 'bangladesh', count: 930 },
    { id: 5, name: 'আন্তর্জাতিক', slug: 'international', count: 240 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>Manage Categories</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Add, edit, or delete news categories.</p>
        </div>
        <button className="btn btn-primary" onClick={() => inputRef.current?.focus()}>
          <Plus size={18} />
          Add Category
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            Add New Category
          </h3>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Category Name</label>
              <input ref={inputRef} type="text" className="input-field" placeholder="e.g. Technology" />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Slug</label>
              <input type="text" className="input-field" placeholder="e.g. technology" />
            </div>
            <button type="button" className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%' }}>Save Category</button>
          </form>
        </div>

        <div className="card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Posts</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat.id}>
                    <td><strong>{cat.name}</strong></td>
                    <td>{cat.slug}</td>
                    <td>{cat.count}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card-hover)', color: 'var(--text-secondary)' }}>
                          <Edit2 size={16} />
                        </button>
                        <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
