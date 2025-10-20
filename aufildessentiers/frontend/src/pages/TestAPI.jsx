// TestAPI.jsx - Page de test pour les API
import React, { useState } from 'react';
import './TestAPI.css';
import { API_ENDPOINTS } from '../config/api';

function TestAPI() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  const addResult = (test, status, data) => {
    setResults(prev => [...prev, {
      id: Date.now(),
      test,
      status,
      data,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const testAPI = async (name, method, url, body = null, headers = {}) => {
    setLoading(true);
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      };
      
      if (body) {
        options.body = JSON.stringify(body);
      }
      
  // If url starts with '/', treat as relative and prepend base
  const fullUrl = url.startsWith('/') ? `${API_ENDPOINTS.BASE_URL}${url}` : url;
  const response = await fetch(fullUrl, options);
      const data = await response.json();
      
      addResult(name, response.ok ? 'success' : 'error', data);
    } catch (error) {
      addResult(name, 'error', { error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email, password) => {
    await testAPI('Connexion', 'POST', '/api/login', { email, password });
  };

  const handleRegister = async () => {
    await testAPI('Inscription', 'POST', '/api/register', {
      email: 'newuser@test.com',
      password: 'motdepasse123',
      name: 'Nouvel Utilisateur'
    });
  };

  const handleProtectedRoute = async () => {
    if (!token) {
      addResult('Route protégée', 'error', { error: 'Token manquant' });
      return;
    }
    await testAPI('Route protégée', 'GET', '/api/protected', null, {
      'Authorization': `Bearer ${token}`
    });
  };

  const handlePublicData = async () => {
    await testAPI('Données publiques', 'GET', '/api/public-data', null, {
      'x-api-key': 'api-key-test-123'
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    addResult('Déconnexion', 'success', { message: 'Déconnecté avec succès' });
  };

  return (
    <div className="test-api">
      <h1>🧪 Test des API Backend</h1>
      
      <div className="user-info">
        {user ? (
          <div className="logged-in">
            <h3>👤 Connecté en tant que : {user.name}</h3>
            <p>📧 {user.email} | 🎭 {user.role}</p>
            <button onClick={handleLogout} className="btn btn-danger">
              Déconnexion
            </button>
          </div>
        ) : (
          <div className="not-logged-in">
            <h3>🔐 Non connecté</h3>
          </div>
        )}
      </div>

      <div className="test-buttons">
        <h3>🚀 Tests disponibles :</h3>
        
        <div className="button-group">
          <h4>📡 Tests de base :</h4>
          <button onClick={() => testAPI('Statut serveur', 'GET', '/')} disabled={loading}>
            Statut serveur
          </button>
          <button onClick={() => testAPI('Santé serveur', 'GET', '/health')} disabled={loading}>
            Santé serveur
          </button>
        </div>

        <div className="button-group">
          <h4>🔐 Authentification :</h4>
          <button onClick={() => handleLogin('admin@test.com', 'motdepasse123')} disabled={loading}>
            Connexion Admin
          </button>
          <button onClick={() => handleLogin('user@test.com', 'motdepasse123')} disabled={loading}>
            Connexion User
          </button>
          <button onClick={handleRegister} disabled={loading}>
            Inscription
          </button>
        </div>

        <div className="button-group">
          <h4>🛡️ Routes protégées :</h4>
          <button onClick={handleProtectedRoute} disabled={loading || !token}>
            Route protégée
          </button>
          <button onClick={handlePublicData} disabled={loading}>
            Données publiques (API Key)
          </button>
        </div>
      </div>

      <div className="results-section">
        <div className="results-header">
          <h3>📊 Résultats des tests :</h3>
          <button onClick={clearResults} className="btn btn-secondary">
            Effacer
          </button>
        </div>
        
        <div className="results-list">
          {results.map(result => (
            <div key={result.id} className={`result-item ${result.status}`}>
              <div className="result-header">
                <span className="test-name">{result.test}</span>
                <span className="timestamp">{result.timestamp}</span>
                <span className={`status ${result.status}`}>
                  {result.status === 'success' ? '✅' : '❌'}
                </span>
              </div>
              <pre className="result-data">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </div>

      {loading && <div className="loading">⏳ Test en cours...</div>}
    </div>
  );
}

export default TestAPI;
