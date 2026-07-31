'use client';
import { useState, useEffect } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { fetchAPI } from '@/lib/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await fetchAPI('/users');
      if (res.success) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id: string, currentRole: string) => {
    const newRole = prompt('নতুন রোল লিখুন (admin, editor, user):', currentRole);
    if (!newRole || newRole === currentRole) return;
    
    try {
      const res = await fetchAPI(`/users/${id}`, {
        method: 'PUT',
        data: { role: newRole }
      });
      if (res.success) {
        setUsers(users.map(u => u._id === id ? res.data : u));
      }
    } catch (err: any) {
      alert(err.message || 'ইউজার আপডেট করতে সমস্যা হয়েছে');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে আপনি এই ইউজার মুছে ফেলতে চান?')) return;
    try {
      await fetchAPI(`/users/${id}`, { method: 'DELETE' });
      setUsers(users.filter(u => u._id !== id));
    } catch (err: any) {
      alert(err.message || 'ইউজার মুছতে সমস্যা হয়েছে');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>ইউজার ম্যানেজমেন্ট</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>ড্যাশবোর্ড অ্যাক্সেস রোল দেখুন এবং পরিবর্তন করুন।</p>
        </div>
      </header>

      <div className="card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>নাম</th>
                <th>ইমেইল</th>
                <th>রোল</th>
                <th>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '1rem' }}>ইউজার লোড হচ্ছে...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '1rem' }}>কোনো ইউজার পাওয়া যায়নি।</td></tr>
              ) : (
                users.map(user => (
                  <tr key={user._id}>
                    <td><strong>{user.name}</strong></td>
                    <td>{user.email}</td>
                    <td>
                      <span className="badge" style={{ background: 'var(--bg-card-hover)', cursor: 'pointer' }} onClick={() => handleRoleChange(user._id, user.role)} title="রোল পরিবর্তন করতে ক্লিক করুন">
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleDelete(user._id)} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', cursor: 'pointer', border: 'none' }}>
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
