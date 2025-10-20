import { useState, useCallback } from 'react';

let uid = 1;
export default function useToasts() {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((payload, type = 'info', duration) => {
    const id = uid++;
    // payload can be a string (message) or an object { title, message }
    const normalized = typeof payload === 'string' ? { message: payload } : (payload || {});
    setToasts(t => [...t, { id, type, duration, ...normalized }]);
    return id;
  }, []);

  const remove = useCallback((id) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  return { toasts, push, remove };
}
