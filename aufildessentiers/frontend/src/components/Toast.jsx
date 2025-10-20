import React, { useEffect } from 'react';
import './Toast.css';

export default function Toast({ id, title, message, type = 'info', onClose, duration = 3500 }) {
  useEffect(() => {
    const t = setTimeout(() => onClose && onClose(id), duration);
    return () => clearTimeout(t);
  }, [id, onClose, duration]);

  const icon = type === 'success' ? '✓' : type === 'error' ? '⚠' : 'ℹ';

  return (
    <div className={`toast toast-${type}`} role="status" aria-live="polite">
      <div className="icon" aria-hidden>{icon}</div>
      <div className="toast-content">
        {title && <div className="toast-title">{title}</div>}
        <div className="toast-message">{message}</div>
      </div>
      <button className="toast-close" onClick={() => onClose && onClose(id)} aria-label="Fermer">×</button>
    </div>
  );
}
