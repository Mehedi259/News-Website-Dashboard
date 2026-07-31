'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import styles from './page.module.css';
import { fetchAPI } from '@/lib/api';

interface Post {
  _id: string;
  title: string;
  category: { name: string } | null;
  created_at?: string;
  createdAt?: string;
  status: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPosts();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadPosts = async () => {
    try {
      const endpoint = search ? `/posts?search=${encodeURIComponent(search)}` : '/posts';
      const res = await fetchAPI(endpoint);
      if (res.success) {
        setPosts(res.data);
      }
    } catch (err) {
      console.error('Failed to load posts', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে আপনি এই পোস্টটি মুছে ফেলতে চান?')) return;
    try {
      await fetchAPI(`/posts/${id}`, { method: 'DELETE' });
      setPosts(posts.filter(p => p._id !== id));
    } catch (err) {
      console.error('Failed to delete post', err);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>পোস্ট ম্যানেজমেন্ট</h1>
          <p className={styles.subtitle}>সংবাদ প্রবন্ধগুলো দেখুন, সম্পাদনা করুন এবং তৈরি করুন।</p>
        </div>
        <Link href="/posts/new" className="btn btn-primary">
          <Plus size={18} />
          নতুন পোস্ট
        </Link>
      </header>

      <div className="card">
        <div className={styles.toolbar}>
          <div className="input-group" style={{ marginBottom: 0, width: '300px' }}>
            <div className={styles.searchBox}>
              <Search size={18} className={styles.searchIcon} />
              <input type="text" placeholder="পোস্ট অনুসন্ধান করুন..." className="input-field" style={{ paddingLeft: '2.5rem' }} value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
          <button className="btn btn-secondary">
            <Filter size={18} />
            ফিল্টার
          </button>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>শিরোনাম</th>
                <th>ক্যাটাগরি</th>
                <th>তারিখ</th>
                <th>স্ট্যাটাস</th>
                <th>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>পোস্ট লোড হচ্ছে...</td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>কোনো পোস্ট পাওয়া যায়নি।</td>
                </tr>
              ) : (
                posts.map(post => (
                  <tr key={post._id}>
                    <td>
                      <div className={styles.postTitle}>{post.title}</div>
                    </td>
                    <td>
                      <span className="badge" style={{ background: 'var(--bg-card-hover)' }}>
                        {post.category?.name || 'ক্যাটাগরি নেই'}
                      </span>
                    </td>
                    <td>{new Date(post.created_at || post.createdAt || new Date()).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${post.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                        {post.status || 'খসড়া'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <Link href={`/posts/edit/${post._id}`} className={styles.actionBtn}>
                          <Edit2 size={16} />
                        </Link>
                        <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => handleDelete(post._id)}>
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
        
        {!loading && posts.length > 0 && (
          <div className={styles.pagination}>
            <span className={styles.pageInfo}>মোট {posts.length} টি পোস্ট দেখাচ্ছে</span>
            <div className={styles.pageControls}>
              <button className="btn btn-secondary" disabled>পূর্ববর্তী</button>
              <button className="btn btn-secondary" disabled>পরবর্তী</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
