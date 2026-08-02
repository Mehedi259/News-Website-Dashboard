'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import styles from './page.module.css';
import { fetchAPI } from '@/lib/api';

interface Category {
  _id: string;
  name: string;
}

export default function NewPostPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('published');
  const [image, setImage] = useState('');
  const [reporter, setReporter] = useState('');
  const [publishedDate, setPublishedDate] = useState('');
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await fetchAPI('/categories');
      if (res.success) {
        setCategories(res.data);
        if (res.data.length > 0) {
          setCategory(res.data[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\s\u0980-\u09FF-]/g, '')
      .toLowerCase() + '-' + Date.now();
  };

  const handleSave = async (isDraft: boolean = false) => {
    if (!title || !content || !category) {
      setError('শিরোনাম, কনটেন্ট এবং ক্যাটাগরি দেওয়া বাধ্যতামূলক।');
      return;
    }

    setLoading(true);
    setError('');

    const postStatus = isDraft ? 'draft' : status;
    const slug = generateSlug(title);

    const postData = {
      title,
      slug,
      content,
      category,
      status: postStatus,
      image: image || '/images/hero_news_oman_1783894879641.png', // Fallback image if empty
      reporter,
      published_date: publishedDate ? new Date(publishedDate).toISOString() : null,
    };

    try {
      const res = await fetchAPI('/posts', {
        data: postData,
      });

      if (res.success) {
        router.push('/posts');
      } else {
        setError('পোস্ট তৈরি করা সম্ভব হয়নি');
      }
    } catch (err: any) {
      setError(err.message || 'পোস্ট তৈরিতে ত্রুটি');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/posts" className={styles.backBtn}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className={styles.title}>নতুন পোস্ট তৈরি করুন</h1>
            <p className={styles.subtitle}>একটি নতুন সংবাদ প্রবন্ধ লিখুন এবং প্রকাশ করুন।</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button 
            className="btn btn-secondary" 
            onClick={() => handleSave(true)}
            disabled={loading}
          >
            খসড়া সংরক্ষণ করুন
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => handleSave(false)}
            disabled={loading}
          >
            <Save size={18} />
            {loading ? 'প্রকাশ হচ্ছে...' : 'পোস্ট প্রকাশ করুন'}
          </button>
        </div>
      </header>

      {error && <div style={{ color: 'red', marginBottom: '1rem', padding: '1rem', background: 'rgba(255,0,0,0.1)', borderRadius: '8px' }}>{error}</div>}

      <div className={styles.formGrid}>
        <div className={styles.mainContent}>
          <div className="card">
            <div className="input-group">
              <label className="input-label">পোস্টের শিরোনাম</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="একটি আকর্ষণীয় শিরোনাম দিন..." 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">কনটেন্ট</label>
              <div className={styles.editorPlaceholder}>
                <div className={styles.editorToolbar}>
                  <span className={styles.editorTool}>B</span>
                  <span className={styles.editorTool}>I</span>
                  <span className={styles.editorTool}>U</span>
                  <span className={styles.editorTool}>🔗</span>
                  <span className={styles.editorTool}>“</span>
                </div>
                <textarea 
                  className={styles.editorTextarea} 
                  placeholder="এখানে আপনার প্রবন্ধের কনটেন্ট লিখুন..."
                  rows={15}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                ></textarea>
              </div>
            </div>

          </div>
        </div>

        <div className={styles.sideContent}>
          <div className="card">
            <h3 className={styles.sectionTitle}>পাবলিশিং ডিটেইলস</h3>
            <div className="input-group">
              <label className="input-label">রিপোর্টার</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="রিপোর্টারের নাম" 
                value={reporter}
                onChange={(e) => setReporter(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">প্রকাশের তারিখ ও সময়</label>
              <input 
                type="datetime-local" 
                className="input-field" 
                value={publishedDate}
                onChange={(e) => setPublishedDate(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">ক্যাটাগরি</label>
              <select 
                className="input-field" 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.length === 0 && <option value="">লোড হচ্ছে...</option>}
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">স্ট্যাটাস</label>
              <select 
                className="input-field"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="draft">খসড়া</option>
                <option value="published">প্রকাশিত</option>
              </select>
            </div>
          </div>

          <div className="card">
            <h3 className={styles.sectionTitle}>ফিচার্ড ছবি</h3>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">ছবি আপলোড করুন</label>
              <div 
                className={styles.imageUpload} 
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                <ImageIcon size={24} className={styles.uploadIcon} />
                <span className={styles.uploadText}>ছবি নির্বাচন করতে ক্লিক করুন</span>
                <span className={styles.uploadHint}>JPG, PNG, GIF সর্বোচ্চ 5MB</span>
              </div>
              <input 
                id="image-upload"
                type="file" 
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
              {image && (
                <div style={{ marginTop: '10px', width: '100%', height: '120px', background: `url(${image}) center/cover`, borderRadius: '4px' }} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
