// Cart API Service
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class CartService {
  // Get user's cart from backend
  async getCart(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      return data.cart || [];
    } catch (error) {
      console.error('Error fetching cart:', error);
      // Return localStorage backup if API fails
      const localCart = localStorage.getItem('natureplant-cart');
      return localCart ? JSON.parse(localCart) : [];
    }
  }

  // Add item to cart
  async addToCart(userId, product, quantity = 1) {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId,
          productId: product.id,
          product,
          quantity
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  // Update item quantity
  async updateCartItem(userId, productId, quantity) {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId,
          productId,
          quantity
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update cart item');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  }

  // Remove item from cart
  async removeFromCart(userId, productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId,
          productId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }

      return await response.json();
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  // Clear entire cart
  async clearCart(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/clear`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }

      return await response.json();
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  // Sync local cart with backend
  async syncCart(userId, localCartItems) {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId,
          cartItems: localCartItems
        })
      });

      if (!response.ok) {
        throw new Error('Failed to sync cart');
      }

      return await response.json();
    } catch (error) {
      console.error('Error syncing cart:', error);
      throw error;
    }
  }
}

export default new CartService();
