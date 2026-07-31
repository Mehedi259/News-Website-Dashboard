'use client';
import { Bell, Search, User, Menu } from 'lucide-react';
import styles from './Header.module.css';

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <button 
          className={styles.menuBtn} 
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} size={18} />
          <input 
            type="text" 
            placeholder="অনুসন্ধান করুন..." 
            className={styles.searchInput}
          />
        </div>
      </div>
      
      <div className={styles.actions}>
        <button className={styles.iconBtn} onClick={() => alert('কোনো নতুন নোটিফিকেশন নেই')}>
          <Bell size={20} />
          <span className={styles.badge}>3</span>
        </button>
        
        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            <User size={18} />
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>অ্যাডমিন ইউজার</span>
            <span className={styles.userRole}>সুপার অ্যাডমিন</span>
          </div>
        </div>
      </div>
    </header>
  );
}
