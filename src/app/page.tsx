'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, Users, FileText, Activity } from 'lucide-react';
import styles from './page.module.css';
import { fetchAPI } from '@/lib/api';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetchAPI('/dashboard/stats');
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const stats = [
    { label: 'Total Posts', value: data?.totalPosts || 0, icon: FileText, change: '+12%', positive: true },
    { label: 'Total Views', value: data?.totalViews || 0, icon: Activity, change: '+24%', positive: true },
    { label: 'Active Users', value: data?.activeUsers || 0, icon: Users, change: '+5%', positive: true },
    { label: 'Bounce Rate', value: `${data?.bounceRate || 0}%`, icon: TrendingUp, change: '-2%', positive: true },
  ];

  // Prepare chart data dynamically
  const rawChartData = data?.chartData || [0, 0, 0, 0, 0, 0, 0];
  const maxView = Math.max(...rawChartData, 1); // Avoid division by zero
  const normalizedChartData = rawChartData.map((val: number) => ({
    raw: val,
    percent: (val / maxView) * 100
  }));

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard Overview</h1>
          <p className={styles.subtitle}>Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>
        <Link href="/posts/new" className="btn btn-primary">
          <FileText size={18} />
          Create New Post
        </Link>
      </header>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading stats...</div>
      ) : (
        <>
          <div className={styles.statsGrid}>
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="card">
                  <div className={styles.statHeader}>
                    <div className={styles.statIcon}>
                      <Icon size={20} />
                    </div>
                    <span className={`${styles.statChange} ${stat.positive ? styles.positive : styles.negative}`}>
                      {stat.change}
                    </span>
                  </div>
                  <div className={styles.statInfo}>
                    <h3 className={styles.statValue}>{stat.value}</h3>
                    <p className={styles.statLabel}>{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.contentGrid}>
            <div className={`card ${styles.mainCard}`}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Audience Overview (Last 7 Days)</h2>
              </div>
              <div className={styles.chartPlaceholder}>
                {/* Minimalist mock chart lines using CSS */}
                <div className={styles.chartLines}>
                  {[1, 2, 3, 4, 5].map(i => <div key={i} className={styles.chartLine}></div>)}
                </div>
                <div className={styles.chartBars}>
                  {normalizedChartData.map((dataPoint: any, i: number) => (
                    <div key={i} className={styles.chartBar} style={{ height: `${dataPoint.percent}%` }}>
                      <div className={styles.chartTooltip}>{dataPoint.raw}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`card ${styles.sideCard}`}>
              <h2 className={styles.cardTitle}>Recent Posts</h2>
              <div className={styles.recentList}>
                {data?.recentPosts?.map((post: any) => (
                  <div key={post._id} className={styles.recentItem}>
                    <div className={styles.recentImage} style={post.image ? { backgroundImage: `url(${post.image})`, backgroundSize: 'cover' } : {}}></div>
                    <div className={styles.recentInfo}>
                      <h4 className={styles.recentTitle}>{post.title}</h4>
                      <span className={styles.recentTime}>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                {(!data?.recentPosts || data.recentPosts.length === 0) && (
                  <div style={{ padding: '1rem', color: 'var(--text-muted)' }}>No recent posts found.</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
