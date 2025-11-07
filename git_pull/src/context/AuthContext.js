import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/backend/api/check_auth.php', {
          method: 'GET',
          credentials: 'include', // Include cookies
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        
        if (data.success && data.data) {
          setCurrentUser({
            id: data.data.user_id,
            email: data.data.email,
            firstName: data.data.first_name,
            lastName: data.data.last_name
          });
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function - now expects user data instead of token
  const login = (userData) => {
    setCurrentUser({
      id: userData.user_id,
      email: userData.email,
      firstName: userData.first_name,
      lastName: userData.last_name
    });
  };

  // Logout function
  const logout = async () => {
    try {
      await fetch('/backend/api/logout.php', {
        method: 'POST',
        credentials: 'include', // Include cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setCurrentUser(null);
    }
  };

  const value = {
    currentUser,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
