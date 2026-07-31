'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAPI, setAuthToken } from '@/lib/api';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetchAPI('/auth/login', {
        data: { email, password },
      });

      if (res.success && res.data.token) {
        if (res.data.role !== 'admin' && res.data.role !== 'editor') {
          setError('ড্যাশবোর্ডে প্রবেশ করার অনুমতি আপনার নেই।');
          return;
        }
        setAuthToken(res.data.token);
        router.push('/');
      } else {
        setError('লগইন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      }
    } catch (err: any) {
      setError(err.message || 'ভুল ইমেইল বা পাসওয়ার্ড');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <h1 className={styles.title}>হ্যালো ওমান অ্যাডমিন</h1>
        <p className={styles.subtitle}>ড্যাশবোর্ডে প্রবেশ করতে লগইন করুন</p>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label className={styles.label}>ইমেইল অ্যাড্রেস</label>
            <input 
              type="email" 
              className={styles.input} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              placeholder="admin@example.com"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>পাসওয়ার্ড</label>
            <input 
              type="password" 
              className={styles.input} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'লগইন হচ্ছে...' : 'লগইন'}
          </button>
        </form>
      </div>
    </div>
  );
}
