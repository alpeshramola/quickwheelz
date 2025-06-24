import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container nav-container" style={{ display: 'flex', alignItems: 'center' }}>
        <img src={process.env.PUBLIC_URL + '/logo.jpg'} alt="Bike Logo" style={{ height: '80px', width: 'auto', marginRight: '24px', background: 'none' }} />
        <Link to="/" className="logo" style={{ fontWeight: 'bold', fontSize: '2rem', textDecoration: 'none' }}>
          QuickWheelz
        </Link>
        <ul className="nav-links" style={{ marginLeft: 'auto' }}>
          {user ? (
            <>
              <li>
                <Link to="/browse">Browse Bikes</Link>
              </li>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="btn btn-primary">
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 