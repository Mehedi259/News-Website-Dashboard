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
    if (!confirm('Are you sure you want to delete this post?')) return;
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
          <h1 className={styles.title}>Manage Posts</h1>
          <p className={styles.subtitle}>View, edit, and create news articles.</p>
        </div>
        <Link href="/posts/new" className="btn btn-primary">
          <Plus size={18} />
          New Post
        </Link>
      </header>

      <div className="card">
        <div className={styles.toolbar}>
          <div className="input-group" style={{ marginBottom: 0, width: '300px' }}>
            <div className={styles.searchBox}>
              <Search size={18} className={styles.searchIcon} />
              <input type="text" placeholder="Search posts..." className="input-field" style={{ paddingLeft: '2.5rem' }} value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
          <button className="btn btn-secondary">
            <Filter size={18} />
            Filters
          </button>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>Loading posts...</td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>No posts found.</td>
                </tr>
              ) : (
                posts.map(post => (
                  <tr key={post._id}>
                    <td>
                      <div className={styles.postTitle}>{post.title}</div>
                    </td>
                    <td>
                      <span className="badge" style={{ background: 'var(--bg-card-hover)' }}>
                        {post.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td>{new Date(post.created_at || post.createdAt || new Date()).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${post.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                        {post.status || 'draft'}
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
            <span className={styles.pageInfo}>Showing {posts.length} posts</span>
            <div className={styles.pageControls}>
              <button className="btn btn-secondary" disabled>Previous</button>
              <button className="btn btn-secondary" disabled>Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
