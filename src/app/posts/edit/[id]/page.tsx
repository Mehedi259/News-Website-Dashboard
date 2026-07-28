'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import styles from './page.module.css';
import { fetchAPI } from '@/lib/api';

interface Category {
  _id: string;
  name: string;
}

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('published');
  const [image, setImage] = useState('');
  
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
    if (id) {
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    try {
      const res = await fetchAPI(`/posts/${id}`);
      if (res.success && res.data) {
        setTitle(res.data.title || '');
        setContent(res.data.content || '');
        setCategory(res.data.category?._id || res.data.category || '');
        setStatus(res.data.status || 'published');
        setImage(res.data.image || '');
      }
    } catch (err) {
      console.error('Failed to load post', err);
      setError('Failed to load post data');
    }
  };

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
      setError('Title, content, and category are required.');
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
    };

    try {
      const res = await fetchAPI(`/posts/${id}`, {
        method: 'PUT',
        data: postData,
      });

      if (res.success) {
        router.push('/posts');
      } else {
        setError('Failed to create post');
      }
    } catch (err: any) {
      setError(err.message || 'Error creating post');
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
            <h1 className={styles.title}>Edit Post</h1>
            <p className={styles.subtitle}>Update your news article.</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button 
            className="btn btn-secondary" 
            onClick={() => handleSave(true)}
            disabled={loading}
          >
            Save Draft
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => handleSave(false)}
            disabled={loading}
          >
            <Save size={18} />
            {loading ? 'Publishing...' : 'Update Post'}
          </button>
        </div>
      </header>

      {error && <div style={{ color: 'red', marginBottom: '1rem', padding: '1rem', background: 'rgba(255,0,0,0.1)', borderRadius: '8px' }}>{error}</div>}

      <div className={styles.formGrid}>
        <div className={styles.mainContent}>
          <div className="card">
            <div className="input-group">
              <label className="input-label">Post Title</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Enter an engaging title..." 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">Content</label>
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
                  placeholder="Write your article content here..."
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
            <h3 className={styles.sectionTitle}>Publishing Details</h3>
            <div className="input-group">
              <label className="input-label">Category</label>
              <select 
                className="input-field" 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.length === 0 && <option value="">Loading...</option>}
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Status</label>
              <select 
                className="input-field"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div className="card">
            <h3 className={styles.sectionTitle}>Featured Image</h3>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Upload Image</label>
              <div 
                className={styles.imageUpload} 
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                <ImageIcon size={24} className={styles.uploadIcon} />
                <span className={styles.uploadText}>Click to select image</span>
                <span className={styles.uploadHint}>JPG, PNG, GIF up to 5MB</span>
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
