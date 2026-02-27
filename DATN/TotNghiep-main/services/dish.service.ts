// services/dish.service.ts
import axios from './axios';

export const getActiveDishes = () =>
  axios.get('/api/dishs');

export const createDish = (formData: FormData) =>
  axios.post('/api/dishs/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const toggleDishStatus = (dishId: number) =>
  axios.put(`/api/dishs/${dishId}/toggle-status`);

export const getDishsByUser = (userId: number , page : number, PAGE_SIZE :number) =>
  axios.get(`/api/dishs/user/${userId}?page=${page}&size=${PAGE_SIZE}`);

export const getDishsByRecipe = (recipeId: number , page : number, PAGE_SIZE :number) =>
  axios.get(`/api/dishs/recipe/${recipeId}?page=${page}&size=${PAGE_SIZE}`);
