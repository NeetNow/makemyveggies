import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

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
  const authContext = useAuth();
  const currentUser = authContext.currentUser;

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart items from backend
  const fetchCartItems = useCallback(async () => {
    // If currentUser is null or undefined, it means AuthProvider is still initializing
    // or user is not logged in. In either case, set cart to empty and stop loading.
    if (!currentUser) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/backend/api/get_cart.php', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setCartItems(data.data);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Load cart items when user changes or component mounts
  useEffect(() => {
    setLoading(true);
    fetchCartItems();
  }, [fetchCartItems]);

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    if (!currentUser) {
      console.error('User must be logged in to add items to cart');
      return;
    }

    try {
      const response = await fetch('/backend/api/add_to_cart.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: product.id || product.product_id,
          quantity: quantity
        })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        // Refresh cart items
        await fetchCartItems();
      } else {
        console.error('Error adding to cart:', data.message);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Remove item from cart
  const removeFromCart = async (cartId) => {
    if (!currentUser) {
      console.error('User must be logged in to modify cart');
      return;
    }

    try {
      const response = await fetch('/backend/api/update_cart_item.php', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart_id: cartId,
          quantity: 0
        })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        // Refresh cart items
        await fetchCartItems();
      } else {
        console.error('Error removing from cart:', data.message);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  // Update item quantity
  const updateQuantity = async (cartId, quantity) => {
    if (!currentUser) {
      console.error('User must be logged in to modify cart');
      return;
    }

    if (quantity <= 0) {
      await removeFromCart(cartId);
      return;
    }

    try {
      const response = await fetch('/backend/api/update_cart_item.php', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart_id: cartId,
          quantity: quantity
        })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        // Refresh cart items
        await fetchCartItems();
      } else {
        console.error('Error updating cart item:', data.message);
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!currentUser) {
      setCartItems([]);
      return;
    }

    try {
      const response = await fetch('/backend/api/clear_cart.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setCartItems([]);
      } else {
        console.error('Error clearing cart:', data.message);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      setCartItems([]);
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
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    loading,
    fetchCart: fetchCartItems
  };

  // Don't block rendering with loading state - just show children
  // The cart will update once loading is complete
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
