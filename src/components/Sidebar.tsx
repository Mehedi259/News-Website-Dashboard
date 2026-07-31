'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Tags, Settings, Users, X } from 'lucide-react';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const navItems = [
    { name: 'ড্যাশবোর্ড', href: '/', icon: LayoutDashboard },
    { name: 'পোস্ট', href: '/posts', icon: FileText },
    { name: 'ক্যাটাগরি', href: '/categories', icon: Tags },
    { name: 'ইউজার', href: '/users', icon: Users },
  ];

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.logoContainer}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className={styles.logoIcon}>H</div>
          <h1 className={styles.logoText}>হ্যালো ওমান অ্যাডমিন</h1>
        </div>
        <button 
          className={styles.closeBtn} 
          onClick={() => setIsOpen(false)}
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>
      
      <nav className={styles.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <Icon size={20} className={styles.navIcon} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className={styles.footer}>
        <p className={styles.version}>ভার্সন ১.০.০</p>
      </div>
    </aside>
  );
}
