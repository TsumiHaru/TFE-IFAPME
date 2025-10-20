import React from 'react';
import Toast from './Toast';
import './Toast.css';

export default function ToastContainer({ toasts = [], onClose }) {
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(t => (
        <Toast key={t.id} id={t.id} message={t.message} type={t.type} onClose={onClose} duration={t.duration} />
      ))}
    </div>
  );
}
