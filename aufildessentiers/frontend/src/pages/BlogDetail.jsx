import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import styles from './Blog.module.css';
import { fetchArticle } from '../services/blogService';

// Very small sanitizer: strip <script> tags and remove inline event handlers (on*)
function sanitizeHTML(html = '') {
  // remove script tags
  let sanitized = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
  // remove on* attributes
  sanitized = sanitized.replace(/\son[a-zA-Z]+\s*=\s*['"][^'"]*['"]/gi, '');
  return sanitized;
}

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchArticle(id)
      .then(data => { if (mounted) setArticle(data.article || null); })
      .catch(err => console.error('Erreur article:', err))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div className={styles.container}><p>Chargement...</p></div>;
  if (!article) return <div className={styles.container}><p>Article introuvable.</p></div>;

  return (
    <div className={styles.container}>
      <article className={styles.detailCard}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>← Retour</button>
        {article.image ? <img src={article.image} alt="" className={styles.detailImage} /> : null}
        <h1>{article.title}</h1>
        <div className={styles.meta}>Par {article.author} • {new Date(article.published_at || article.publishedAt).toLocaleDateString()}</div>
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.content || article.excerpt) }} />
      </article>
    </div>
  );
}
