import Link from 'next/link';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import styles from './page.module.css';

export default function PostsPage() {
  const posts = [
    { id: 1, title: 'ওমানে সিলেট টু ওমান প্রবাসী ফোরামের আলোচনা সভা অনুষ্ঠিত', category: 'প্রবাস', date: '১৩ জুলাই ২০২৬', status: 'Published' },
    { id: 2, title: 'নতুন ভিসা নীতি ঘোষণা করল সৌদি আরব', category: 'মধ্যপ্রাচ্য', date: '১২ জুলাই ২০২৬', status: 'Draft' },
    { id: 3, title: 'বিশ্বকাপ ক্রিকেটে বাংলাদেশের জয়', category: 'খেলাধুলা', date: '১১ জুলাই ২০২৬', status: 'Published' },
    { id: 4, title: 'বাজেট ২০২৬: অর্থনীতিতে নতুন দিশা', category: 'অর্থনীতি', date: '১০ জুলাই ২০২৬', status: 'Published' },
    { id: 5, title: 'ঢাকার বায়ু দূষণ রোধে নতুন পদক্ষেপ', category: 'বাংলাদেশ', date: '০৯ জুলাই ২০২৬', status: 'Draft' },
  ];

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
              <input type="text" placeholder="Search posts..." className="input-field" style={{ paddingLeft: '2.5rem' }} />
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
              {posts.map(post => (
                <tr key={post.id}>
                  <td>
                    <div className={styles.postTitle}>{post.title}</div>
                  </td>
                  <td>
                    <span className="badge" style={{ background: 'var(--bg-card-hover)' }}>{post.category}</span>
                  </td>
                  <td>{post.date}</td>
                  <td>
                    <span className={`badge ${post.status === 'Published' ? 'badge-success' : 'badge-warning'}`}>
                      {post.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.actionBtn}>
                        <Edit2 size={16} />
                      </button>
                      <button className={`${styles.actionBtn} ${styles.danger}`}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className={styles.pagination}>
          <span className={styles.pageInfo}>Showing 1 to 5 of 24 posts</span>
          <div className={styles.pageControls}>
            <button className="btn btn-secondary" disabled>Previous</button>
            <button className="btn btn-secondary">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
