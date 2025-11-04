import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './Navbar.css';

export default function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await api.logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          <span className="logo-icon">💪</span>
          <span className="logo-text">Street Workout</span>
        </Link>
        
        <div className="navbar-menu">
          <Link to="/dashboard" className="navbar-link">Главная</Link>
          <Link to="/programs" className="navbar-link">Программы</Link>
          <Link to="/nutrition" className="navbar-link">Питание</Link>
          <Link to="/statistics" className="navbar-link">Статистика</Link>
          {user && (
            <div className="navbar-user">
              <span className="user-name">{user.name}</span>
              <button onClick={handleLogout} className="logout-btn">
                Выход
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

