import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../../services/api';
import './Navbar.css';

export default function Navbar({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await api.logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Главная' },
    { to: '/programs', label: 'Программы' },
    { to: '/nutrition', label: 'Питание' },
    { to: '/statistics', label: 'Статистика' }
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          <span className="logo-icon">💪</span>
          <span className="logo-text">Street Workout</span>
        </Link>
        
        <div className="navbar-menu">
          {navLinks.map((link) => (
            <Link 
              key={link.to} 
              to={link.to} 
              className="navbar-link"
            >
              {link.label}
              {isActive(link.to) && (
                <motion.div
                  className="navbar-link-underline"
                  layoutId="navbar-underline"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30
                  }}
                />
              )}
            </Link>
          ))}
          {user && (
            <div className="navbar-user">
              <span className="user-name">{user.name}</span>
              <motion.button 
                onClick={handleLogout} 
                className="logout-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Выход
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

