import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/Header.module.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const isActiveTab = (path) => {
    return location.pathname === path;
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        
        {/* Logo/Title */}
        <div className={styles.logo} onClick={() => navigate('/home')}>
          <h1 className={styles.title}>Trelloer</h1>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          {isLoggedIn ? (
            <>
              <button
                className={`${styles.navTab} ${isActiveTab('/boards') ? styles.activeTab : ''}`}
                onClick={() => navigate('/boards')}
              >
                My Boards
              </button>

              <div className={styles.profileDropdown}>
                <button
                  className={`${styles.navTab} ${isActiveTab('/profile') ? styles.activeTab : ''}`}
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                >
                  My Profile
                  <svg
                    className={`${styles.dropdownIcon} ${isProfileDropdownOpen ? styles.rotated : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isProfileDropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    <button
                      className={styles.dropdownItem}
                      onClick={() => {
                        navigate('/profile');
                        setIsProfileDropdownOpen(false);
                      }}
                    >
                      View Profile
                    </button>
                    <button
                      className={styles.dropdownItem}
                      onClick={() => {
                        navigate('/settings');
                        setIsProfileDropdownOpen(false);
                      }}
                    >
                      Settings
                    </button>
                    <hr className={styles.divider} />
                    <button
                      className={`${styles.dropdownItem} ${styles.logoutItem}`}
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                className={`${styles.navTab} ${isActiveTab('/login') ? styles.activeTab : ''}`}
                onClick={() => navigate('/login')}
              >
                Login
              </button>
              <button
                className={`${styles.navTab} ${isActiveTab('/register') ? styles.activeTab : ''}`}
                onClick={() => navigate('/register')}
              >
                Sign Up
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
