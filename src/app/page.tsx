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
    { label: 'সর্বমোট পোস্ট', value: data?.totalPosts || 0, icon: FileText, change: '+12%', positive: true },
    { label: 'সর্বমোট ভিউ', value: data?.totalViews || 0, icon: Activity, change: '+24%', positive: true },
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
          <h1 className={styles.title}>ড্যাশবোর্ড ওভারভিউ</h1>
          <p className={styles.subtitle}>স্বাগতম! আজকের আপডেটগুলো দেখে নিন।</p>
        </div>
        <Link href="/posts/new" className="btn btn-primary">
          <FileText size={18} />
          নতুন পোস্ট তৈরি করুন
        </Link>
      </header>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>স্ট্যাটস লোড হচ্ছে...</div>
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
                <h2 className={styles.cardTitle}>অডিয়েন্স ওভারভিউ (গত ৭ দিন)</h2>
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
              <h2 className={styles.cardTitle}>সাম্প্রতিক পোস্টসমূহ</h2>
              <div className={styles.recentList}>
                {data?.recentPosts?.map((post: any) => (
                  <div key={post._id} className={styles.recentItem}>
                    <div className={styles.recentImage} style={post.image ? { backgroundImage: `url(${post.image.startsWith('/') ? 'https://helloomanbangla.com' + post.image : post.image})`, backgroundSize: 'cover' } : {}}></div>
                    <div className={styles.recentInfo}>
                      <h4 className={styles.recentTitle}>{post.title}</h4>
                      <span className={styles.recentTime}>{new Date(post.created_at || post.createdAt).toLocaleDateString('bn-BD')}</span>
                    </div>
                  </div>
                ))}
                {(!data?.recentPosts || data.recentPosts.length === 0) && (
                  <div style={{ padding: '1rem', color: 'var(--text-muted)' }}>কোনো সাম্প্রতিক পোস্ট পাওয়া যায়নি।</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
