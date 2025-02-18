import React from 'react';
import { Link } from 'react-router-dom';
import 'bulma/css/bulma.min.css';

const Navbar = () => {
  return (
    <nav className="navbar is-light">
      <div className="navbar-brand">
        <Link to="/" className="navbar-item is-size-3">
          μkb
        </Link>
      </div>
      <div className="navbar-menu">
        <div className="navbar-start">
          <Link to="/create" className="navbar-item">
            Upload
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;