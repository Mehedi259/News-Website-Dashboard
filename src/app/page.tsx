import Link from 'next/link';
import { TrendingUp, Users, FileText, Activity } from 'lucide-react';
import styles from './page.module.css';

export default function Dashboard() {
  const stats = [
    { label: 'Total Posts', value: '1,248', icon: FileText, change: '+12%', positive: true },
    { label: 'Total Views', value: '45.2K', icon: Activity, change: '+24%', positive: true },
    { label: 'Active Users', value: '892', icon: Users, change: '-4%', positive: false },
    { label: 'Bounce Rate', value: '42.3%', icon: TrendingUp, change: '-2%', positive: true },
  ];

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
            <h2 className={styles.cardTitle}>Audience Overview</h2>
            <select className={styles.select}>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className={styles.chartPlaceholder}>
            {/* Minimalist mock chart lines using CSS */}
            <div className={styles.chartLines}>
              {[1, 2, 3, 4, 5].map(i => <div key={i} className={styles.chartLine}></div>)}
            </div>
            <div className={styles.chartBars}>
              {[40, 70, 45, 90, 65, 85, 55].map((h, i) => (
                <div key={i} className={styles.chartBar} style={{ height: `${h}%` }}>
                  <div className={styles.chartTooltip}>{h}K</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`card ${styles.sideCard}`}>
          <h2 className={styles.cardTitle}>Recent Posts</h2>
          <div className={styles.recentList}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={styles.recentItem}>
                <div className={styles.recentImage}></div>
                <div className={styles.recentInfo}>
                  <h4 className={styles.recentTitle}>Breaking News Update {i}</h4>
                  <span className={styles.recentTime}>{i * 2} hours ago</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
