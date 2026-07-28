'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { getAuthToken, fetchAPI } from '@/lib/api';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = getAuthToken();
      
      if (!token) {
        if (pathname !== '/login') {
          router.push('/login');
        } else {
          setLoading(false);
        }
        return;
      }

      try {
        const res = await fetchAPI('/auth/me');
        if (res.data.role !== 'admin' && res.data.role !== 'editor') {
          throw new Error('Not authorized for dashboard');
        }
        setIsAuthenticated(true);
        if (pathname === '/login') {
          router.push('/');
        }
      } catch (err) {
        if (pathname !== '/login') {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [pathname, router]);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center' }}>
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header />
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
}
