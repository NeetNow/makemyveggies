import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated by verifying JWT token
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/backend/api/get_user_profile.php', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setUser({
              userId: data.data.user_id,
              email: data.data.email,
              firstName: data.data.first_name,
              lastName: data.data.last_name,
            });
            setIsLoggedIn(true);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // If there's an error checking auth status, keep user logged out
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogin = userData => {
    // With JWT cookies, we don't store in session storage
    // The token is automatically handled by the browser via cookies
    setUser({
      userId: userData.userId,
      email: userData.email,
      firstName: userData.first_name,
      lastName: userData.last_name,
    });
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Clear user data
    setUser(null);
    setIsLoggedIn(false);

    // Call logout API to clear cookie
    fetch('/backend/api/logout.php', {
      method: 'POST',
      credentials: 'include',
    });
  };

  const value = {
    isLoggedIn,
    user,
    loading,
    handleLogin,
    handleLogout,
  };

  return <AuthContext.Provider value={value}> {!loading && children} </AuthContext.Provider>;
};
