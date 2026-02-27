// services/recipe.service.ts
import axios from './axios';

export const getMyRecipes = (page = 0, size = 50) =>
  axios.get('/api/recipes/my', {
    params: {
      page,
      size,
    },
  });

