
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Product, CartItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product & { selectedSize?: string; selectedColor?: string }) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('phantom_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);


  // Mocking imports for now in thought process...

  // Real implementation:

  const [isInitialized, setIsInitialized] = useState(false);

  // Sync with localStorage for guest users
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('phantom_cart', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product: Product & { selectedSize?: string; selectedColor?: string }) => {
    setCart(prev => {
      // Use dimensions from the passed object or defaults
      const itemSize = product.selectedSize || (product.sizes?.[0] || 'Default');
      const itemColor = product.selectedColor || (product.variants?.[0]?.color_name || 'Original');
      
      // Create a unique key for the item based on id, size, and color
      const cartItemId = `${product.id}-${itemSize}-${itemColor}`;

      const existingIndex = prev.findIndex(item => item.cartItemId === cartItemId);

      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex] = { 
          ...newCart[existingIndex], 
          quantity: newCart[existingIndex].quantity + 1 
        };
        return newCart;
      }

      const newItem: CartItem & { cartItemId: string } = {
        ...product,
        cartItemId,
        id: product.id, // Keep original ID for reference
        quantity: 1,
        selectedSize: itemSize,
        selectedColor: itemColor
      };

      return [...prev, newItem];
    });
    openCart();
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => (item as any).cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if ((item as any).cartItemId === cartItemId) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const clearCart = () => setCart([]);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice,
      isCartOpen, setIsCartOpen, openCart, closeCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
