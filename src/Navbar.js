import React from 'react';
import { Link } from 'react-router-dom';
import 'bulma/css/bulma.min.css';

const Navbar = () => {
  return (
    <nav className="navbar is-light">
      <div className="navbar-brand">
        <Link to="/" className="navbar-item is-size-3">
          <strong>μkb</strong>
        </Link>
      </div>
      <div className="navbar-menu">
        <div className="navbar-start">
          <Link to="/create" className="navbar-item">
            Create Package
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;