import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="navbar">
      <Link 
        to="/" 
        className={isActive('/') ? 'active' : ''}
      >
        Problems
      </Link>
      <Link 
        to="/patterns" 
        className={isActive('/patterns') ? 'active' : ''}
      >
        Patterns
      </Link>
      <Link 
        to="/templates" 
        className={isActive('/templates') ? 'active' : ''}
      >
        Templates
      </Link>
    </nav>
  );
};

export default Navbar;
