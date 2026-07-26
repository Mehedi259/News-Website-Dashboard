'use client';
import { useState } from 'react';
import { Save, Globe, Lock, Bell, Palette } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Site Details</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="input-group">
                <label className="input-label">Website Name</label>
                <input type="text" className="input-field" defaultValue="Hellow Oman News" />
              </div>
              <div className="input-group">
                <label className="input-label">Site Tagline</label>
                <input type="text" className="input-field" defaultValue="সবার আগে সব খবর" />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Contact Email</label>
              <input type="email" className="input-field" defaultValue="contact@hellowoman.com" />
            </div>

            <div className="input-group">
              <label className="input-label">Site Description (SEO)</label>
              <textarea className="input-field" rows={4} defaultValue="The most trusted news portal for probashi Bangladeshis in Oman."></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button className="btn btn-primary" onClick={() => alert('General settings saved!')}>
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </div>
        );
      case 'appearance':
        return (
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Appearance Settings</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Appearance settings will be available in the next update.</p>
          </div>
        );
      case 'notifications':
        return (
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Notification Preferences</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Configure email and push notifications here.</p>
          </div>
        );
      case 'security':
        return (
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Security & Privacy</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Update your password and security settings here.</p>
          </div>
        );
      default:
        return null;
    }
  };

  const getTabStyle = (tabId: string) => {
    return {
      padding: '0.75rem 1rem', 
      background: activeTab === tabId ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
      color: activeTab === tabId ? 'var(--accent)' : 'var(--text-secondary)',
      borderRadius: 'var(--radius)', 
      fontWeight: 500, 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.75rem', 
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px' }}>
      <header>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Manage your website and dashboard preferences.</p>
      </header>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        <aside style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={getTabStyle('general')} onClick={() => setActiveTab('general')}>
            <Globe size={18} /> General
          </div>
          <div style={getTabStyle('appearance')} onClick={() => setActiveTab('appearance')}>
            <Palette size={18} /> Appearance
          </div>
          <div style={getTabStyle('notifications')} onClick={() => setActiveTab('notifications')}>
            <Bell size={18} /> Notifications
          </div>
          <div style={getTabStyle('security')} onClick={() => setActiveTab('security')}>
            <Lock size={18} /> Security
          </div>
        </aside>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
