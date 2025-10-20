import { API_ENDPOINTS } from '../config/api';

export async function fetchArticles(page = 1, limit = 20) {
  const token = localStorage.getItem('token');
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
  const res = await fetch(`${API_ENDPOINTS.BLOG}?page=${page}&limit=${limit}`, { headers });
  if (!res.ok) throw new Error('Erreur récupération articles');
  const payload = await res.json();
  // normalize article keys to camelCase
  if (Array.isArray(payload.articles)) {
    payload.articles = payload.articles.map(a => ({
      ...a,
      publishedAt: a.published_at || a.publishedAt || null
    }));
  }
  return payload;
}

export async function fetchArticle(id) {
  const token = localStorage.getItem('token');
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
  const res = await fetch(API_ENDPOINTS.BLOG_ARTICLE(id), { headers });
  if (res.status === 401 || res.status === 403) throw new Error('Unauthorized');
  if (!res.ok) throw new Error('Article introuvable');
  const payload = await res.json();
  if (payload.article) {
    payload.article.publishedAt = payload.article.published_at || payload.article.publishedAt || null;
  }
  return payload;
}

export default { fetchArticles, fetchArticle };
