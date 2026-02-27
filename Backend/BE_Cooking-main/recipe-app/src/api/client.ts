import axios from 'axios';
import type { 
  ApiResponse, 
  AuthRequest, 
  UserDTO, 
  RecipeSummaryDTO, 
  PageDTO,
  RecipeDetailDTO,
  NewRecipeRequest,
  IngredientDTO 
} from '../types';

const API_BASE_URL = 'http://localhost:8080';

// Tạo axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Thêm token vào mọi request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Xử lý lỗi
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: async (credentials: AuthRequest): Promise<string> => {
    const response = await apiClient.post<ApiResponse<string>>(
      '/auth/generateToken',
      credentials
    );
    return response.data.data;
  },
};

// User APIs
export const userAPI = {
  getProfile: async (): Promise<UserDTO> => {
    const response = await apiClient.get<ApiResponse<UserDTO>>('/user/myProfile');
    return response.data.data;
  },
  
  getMyRecipes: async (page = 0, size = 10): Promise<PageDTO<RecipeSummaryDTO>> => {
    const response = await apiClient.get<ApiResponse<PageDTO<RecipeSummaryDTO>>>(
      '/user/list/AllMyRecipes',
      { params: { page, size } }
    );
    return response.data.data;
  },
  
  createRecipe: async (formData: FormData): Promise<string> => {
    const response = await apiClient.post<ApiResponse<string>>(
      '/user/create/recipe',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },
  
  suggestIngredients: async (keyword: string): Promise<IngredientDTO[]> => {
    const response = await apiClient.get<ApiResponse<IngredientDTO[]>>(
      '/user/suggest/ingredients',
      { params: { keyword } }
    );
    return response.data.data;
  },

  getRecipeDetail: async (recipeId: number): Promise<RecipeDetailDTO> => {
    const response = await apiClient.get<ApiResponse<RecipeDetailDTO>>(
      `/user/recipes/${recipeId}`
    );
    return response.data.data;
  },

};

export default apiClient;