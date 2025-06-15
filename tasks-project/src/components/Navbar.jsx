import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { token } = useContext(AuthContext);

  const getNavLinkClass = ({ isActive }) =>
    isActive ? 'nav-link active' : 'nav-link';

  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-light bg-light nav-bg">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="#">
            Authentication & Tasks
          </NavLink>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {token && (
                <>
                  <li className="nav-item">
                    <NavLink className={getNavLinkClass} to="/allusers">
                      Users
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className={getNavLinkClass} to="/tasks">
                      Tasks
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className={getNavLinkClass} to="/categories">
                      Category
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className={getNavLinkClass} to="/profile">
                      Profile
                    </NavLink>
                  </li>
                </>
              )}

              {!token && (
                <>
                  <li className="nav-item">
                    <NavLink className={getNavLinkClass} to="/signin">
                      Sign In
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className={getNavLinkClass} to="/signup">
                      Sign Up
                    </NavLink>
                  </li>
                </>
              )}

              {token && (
                <li className="nav-item">
                  <NavLink className={getNavLinkClass} to="/logout">
                    Logout
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
