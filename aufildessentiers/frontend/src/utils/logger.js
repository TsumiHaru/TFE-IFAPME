// Lightweight logger for frontend
// - logs to console only in development
// - placeholder to extend to remote logging (Sentry, LogRocket, etc.)

import { API_ENDPOINTS } from '../config/api';

const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE === 'development';

export function error(...args) {
  if (isDev) {
    console.error(...args);
  }

  // In development/staging still send to backend logs endpoint for aggregation
  try {
    const payload = {
      level: 'error',
      message: args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' '),
      meta: { userAgent: navigator.userAgent }
    };

    // do not send passwords or tokens: remove obvious sensitive keys
    if (payload.message.toLowerCase().includes('password') || payload.message.toLowerCase().includes('token')) {
      // avoid sending sensitive content
    } else {
      fetch(API_ENDPOINTS.LOGS || (API_ENDPOINTS.BASE_URL + '/api/logs'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});
    }
  } catch (err) {
    if (isDev) console.warn('Logger failed to POST to /api/logs', err);
  }
}

export function warn(...args) {
  if (isDev) console.warn(...args);
}

export function info(...args) {
  if (isDev) console.info(...args);
}

export default { error, warn, info };
