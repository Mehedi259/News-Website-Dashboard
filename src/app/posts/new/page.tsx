'use client';
import Link from 'next/link';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import styles from './page.module.css';

export default function NewPostPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/posts" className={styles.backBtn}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className={styles.title}>Create New Post</h1>
            <p className={styles.subtitle}>Write and publish a new news article.</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button className="btn btn-secondary">Save Draft</button>
          <button className="btn btn-primary">
            <Save size={18} />
            Publish Post
          </button>
        </div>
      </header>

      <div className={styles.formGrid}>
        <div className={styles.mainContent}>
          <div className="card">
            <div className="input-group">
              <label className="input-label">Post Title</label>
              <input type="text" className="input-field" placeholder="Enter an engaging title..." />
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
                ></textarea>
              </div>
            </div>
            
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Excerpt (Optional)</label>
              <textarea 
                className="input-field" 
                placeholder="A short summary of the article..."
                rows={3}
              ></textarea>
            </div>
          </div>
        </div>

        <div className={styles.sideContent}>
          <div className="card">
            <h3 className={styles.sectionTitle}>Publishing Details</h3>
            <div className="input-group">
              <label className="input-label">Category</label>
              <select className="input-field">
                <option>প্রবাস</option>
                <option>বাংলাদেশ</option>
                <option>আন্তর্জাতিক</option>
                <option>খেলাধুলা</option>
                <option>অর্থনীতি</option>
              </select>
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Status</label>
              <select className="input-field">
                <option>Draft</option>
                <option>Published</option>
              </select>
            </div>
          </div>

          <div className="card">
            <h3 className={styles.sectionTitle}>Featured Image</h3>
            <div className={styles.imageUpload}>
              <div className={styles.uploadIcon}>
                <ImageIcon size={32} />
              </div>
              <p className={styles.uploadText}>Click to upload image</p>
              <p className={styles.uploadHint}>SVG, PNG, JPG or GIF (max. 5MB)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
