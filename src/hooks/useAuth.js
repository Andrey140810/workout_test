import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

/**
 * Хук для проверки аутентификации и получения текущего пользователя
 * @param {boolean} requireAuth - Требовать ли аутентификацию (по умолчанию true)
 * @returns {Object} { user, loading }
 */
export function useAuth(requireAuth = true) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = api.getCurrentUser();
    
    if (!currentUser && requireAuth) {
      navigate('/login');
      return;
    }
    
    setUser(currentUser);
    setLoading(false);
  }, [navigate, requireAuth]);

  return { user, loading };
}

