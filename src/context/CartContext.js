import React, { createContext, useContext, useState, useEffect } from 'react';
import cartService from '../services/cartService';

// Create Cart Context
const CartContext = createContext();

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(() => {
    // Get user ID from localStorage or generate a guest ID
    return localStorage.getItem('userId') || `guest_${Date.now()}`;
  });

  // Initialize cart on component mount
  useEffect(() => {
    initializeCart();
  }, [userId]);

  // Save cart to localStorage whenever it changes (backup)
  useEffect(() => {
    localStorage.setItem('natureplant-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Initialize cart from localStorage (frontend-only for now)
  const initializeCart = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load from localStorage directly (skip backend for now)
      const savedCart = localStorage.getItem('natureplant-cart');
      if (savedCart) {
        const localCart = JSON.parse(savedCart);
        setCartItems(localCart);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error('Failed to load cart from localStorage:', err);
      setCartItems([]);
      setError('Failed to load cart. Starting with empty cart.');
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart with backend sync
  const addToCart = async (product, quantity = 1) => {
    setLoading(true);
    setError(null);

    try {
      // Optimistic update
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === product.id);

        if (existingItem) {
          return prevItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }

        return [...prevItems, { ...product, quantity }];
      });

      // Skip backend sync for now - working with localStorage only
      // await cartService.addToCart(userId, product, quantity);
    } catch (err) {
      console.error('Failed to add item to cart:', err);
      setError('Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart with backend sync
  const removeFromCart = async (productId) => {
    setLoading(true);
    setError(null);

    try {
      // Optimistic update
      setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
      
      // Skip backend sync for now - working with localStorage only
      // await cartService.removeFromCart(userId, productId);
    } catch (err) {
      console.error('Failed to remove item from cart:', err);
      setError('Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity with backend sync
  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Optimistic update
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );

      // Skip backend sync for now - working with localStorage only
      // await cartService.updateCartItem(userId, productId, quantity);
    } catch (err) {
      console.error('Failed to update cart item:', err);
      setError('Failed to update cart item');
    } finally {
      setLoading(false);
    }
  };

  // Clear cart with backend sync
  const clearCart = async () => {
    setLoading(true);
    setError(null);

    try {
      // Optimistic update
      setCartItems([]);
      
      // Sync with backend
      await cartService.clearCart(userId);
    } catch (err) {
      console.error('Failed to clear cart:', err);
      setError('Failed to clear cart');
      // Revert optimistic update on error
      await initializeCart();
    } finally {
      setLoading(false);
    }
  };

  // Get cart totals
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    loading,
    error,
    userId,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    initializeCart,
    setError
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
