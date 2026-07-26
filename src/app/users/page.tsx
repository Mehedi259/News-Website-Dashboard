'use client';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function UsersPage() {
  const users = [
    { id: 1, name: 'Admin User', email: 'admin@hellowoman.com', role: 'Super Admin', status: 'Active' },
    { id: 2, name: 'Editor One', email: 'editor1@hellowoman.com', role: 'Editor', status: 'Active' },
    { id: 3, name: 'Writer Pro', email: 'writer@hellowoman.com', role: 'Author', status: 'Inactive' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>Manage Users</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>View, add, and manage dashboard access.</p>
        </div>
        <button className="btn btn-primary" onClick={() => alert('Add User Modal will appear here')}>
          <Plus size={18} />
          Add User
        </button>
      </header>

      <div className="card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td><strong>{user.name}</strong></td>
                  <td>{user.email}</td>
                  <td><span className="badge" style={{ background: 'var(--bg-card-hover)' }}>{user.role}</span></td>
                  <td>
                    <span className={`badge ${user.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                      {user.status}
                    </span>
                  </td>
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
  );
}
