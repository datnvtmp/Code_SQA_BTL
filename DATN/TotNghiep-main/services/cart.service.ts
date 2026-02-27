// services/cart.service.ts
import axios from './axios';

export const addToCart = (dishId: number, quantity = 1) =>
  axios.post('/api/cart/add', { dishId, quantity });

export const getMyCart = () =>
  axios.get('/api/cart/all');

export const updateCartItem = (itemId: number, quantity: number) =>
  axios.put('/api/cart/item/update', { itemId, quantity });

export const removeCartItem = (cartId: number, dishId: number) =>
  axios.delete(`/api/cart/remove/${cartId}/${dishId}`);