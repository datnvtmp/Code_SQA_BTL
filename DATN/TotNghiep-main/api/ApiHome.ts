import { useAuthStore } from "@/store/useAuthStore";
import { ILoginResponse, ILoginPayload, ISignUpPayload, ReplyComment, ISignUpResponse, PostItemProps, FoodDetailData, Comment, Reply, Recipe, CollectionResponse, RecipeItem, RecipeApiResponse, FormattedRecipeItem, LikedRecipesResponse, User, UserResponse, RecipeDetailResponse, IngredientItem, Notification, NotificationGroup, ApiNotiResponse, Topic, ApiTopic } from "@/types/type_index";
import { convertApiRecipesToRecipeItems, convertCollectionsToRecipes, formatLikedRecipes, mapApiToComments, mapApiToFoodDetail, mapApiToReplyComment, mapRecipeToPostItem } from '@/utils/mapRecipeToPostItem';
import { images } from "@constants/index";
import axios from 'axios';
import dayjs from 'dayjs';


export async function login(email: string, password: string): Promise<ILoginResponse> {
  const payload: ILoginPayload = {
    email,
    password,
  };

  try {
    console.log(process.env.NEXT_PUBLIC_API_HOST)
    const response = await axios.post<ILoginResponse>(
      `${process.env.NEXT_PUBLIC_API_HOST}/auth/login`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );


    return response.data;

  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Đăng nhập thất bại");
  }
}

export async function signUp(formData: FormData): Promise<ISignUpResponse> {
  try {
    const response = await axios.post<ISignUpResponse>(
      `${process.env.NEXT_PUBLIC_API_HOST}/auth/register/user`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
  }
}


export async function getCurrentUser(): Promise<User> {
  try {
    const token = useAuthStore.getState().token;

    const response = await axios.get<UserResponse>(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/user/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

export async function getUserById(id = 1): Promise<User> {
  try {
    const token = useAuthStore.getState().token;

    const response = await axios.get<UserResponse>(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/user/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

export async function getRecipesFollowing(page = 0, size = 10) {
  const token = useAuthStore.getState().token;

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/recipes/following-recipes`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { page, size },
    }
  );
  console.log(response.data)
  return response.data.data.content.map(mapRecipeToPostItem);
}

export async function getRecipesLike(page = 0, size = 10) {
  const token = useAuthStore.getState().token;

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/recipes/top-like-recipes`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { page, size },
    }
  );
  console.log(response.data)
  return response.data.data.content.map(mapRecipeToPostItem);
}
export async function getRecipesView(page = 0, size = 10) {
  const token = useAuthStore.getState().token;

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/recipes/top-new-recipes`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { page, size },
    }
  );
  console.log(response.data)
  return response.data.data.content.map(mapRecipeToPostItem);
}


export async function getRecipesHistory(page = 0, size = 10) {
  const token = useAuthStore.getState().token;

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/recipes/recent`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { page, size },
    }
  );
  console.log(response.data)
  return response.data.data.content.map(mapRecipeToPostItem);
}

export async function getRecipesByCate(categoryIds = 1,) {
  try {
    const token = useAuthStore.getState().token;

    const response = await axios.get<RecipeApiResponse>(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/categories/recipes/by-categories`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { categoryIds },
      },

    );

    return convertApiRecipesToRecipeItems(response.data);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
}


export async function getRecipesDetail(id = 1): Promise<FoodDetailData> {
  const token = useAuthStore.getState().token;

  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/api/recipes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return mapApiToFoodDetail(response.data.data);
}

export async function getRecipesComment(recipeId = 1): Promise<{ comments: Comment[]; total: number }> {
  const token = useAuthStore.getState().token;

  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/api/recipes/${recipeId}/comments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return {
    comments: mapApiToComments(response.data.data),
    total: response.data.data.totalElements, // trả thêm tổng số comment
  };
}

export async function getReplyComment(parentCommentId = 1): Promise<ReplyComment> {
  const token = useAuthStore.getState().token;

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/comment/${parentCommentId}/replies?page=0&size=10`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  // map API data sang ReplyComment
  return mapApiToReplyComment(response.data.data);
}

export async function getMyCollection(): Promise<Recipe[]> {
  try {
    const token = useAuthStore.getState().token;

    // Get user info first
    const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/api/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const userId = userResponse.data.data.id;

    // Get collection data
    const collectionResponse = await axios.get<CollectionResponse>(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/collections/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Convert to Recipe format
    return convertCollectionsToRecipes(collectionResponse.data);
  } catch (error) {
    console.error('Error fetching collection:', error);
    throw error;
  }
}

export async function getUserCollection(userId = 1): Promise<Recipe[]> {
  try {
    const token = useAuthStore.getState().token;

    // Get collection data
    const collectionResponse = await axios.get<CollectionResponse>(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/collections/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Convert to Recipe format
    return convertCollectionsToRecipes(collectionResponse.data);
  } catch (error) {
    console.error('Error fetching collection:', error);
    throw error;
  }
}


export async function getMyRecipe(page = 0, size = 10): Promise<RecipeItem[]> {
  try {
    const token = useAuthStore.getState().token;

    const response = await axios.get<RecipeApiResponse>(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/recipes/my?page=${page}&size=${size}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return convertApiRecipesToRecipeItems(response.data);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
}


export async function getUserRecipe(userId = 1, page = 0, size = 10): Promise<RecipeItem[]> {
  try {
    const token = useAuthStore.getState().token;

    const response = await axios.get<RecipeApiResponse>(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/recipes/user/${userId}/public-recipes?page=${page}&size=${size}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return convertApiRecipesToRecipeItems(response.data);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
}

export async function getLikedRecipes(page: number = 0, size: number = 10): Promise<FormattedRecipeItem[]> {
  try {
    const token = useAuthStore.getState().token;

    const response = await axios.get<LikedRecipesResponse>(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/recipes/liked`,
      {
        params: {
          page,
          size
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Format data to match RecipeItem interface
    return formatLikedRecipes(response.data);
  } catch (error) {
    console.error('Error fetching liked recipes:', error);
    throw error;
  }
}

export async function getRecipesBySearch(
  page: number = 0,
  size: number = 10,
  keyword = '',
): Promise<FormattedRecipeItem[]> {
  try {
    const token = useAuthStore.getState().token;

    const response = await axios.get<LikedRecipesResponse>(
      `${process.env.NEXT_PUBLIC_API_HOST}/user/test/recipes/search`,
      {
        params: {
          page,
          size,
          keyword,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data)
    return formatLikedRecipes(response.data);
  } catch (error) {
    console.error('Error fetching liked recipes:', error);
    throw error;
  }
}


export async function getIngredientsData(id = 1): Promise<RecipeDetailResponse> {
  try {
    const token = useAuthStore.getState().token;

    const response = await axios.get<RecipeDetailResponse>(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/recipes/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
}

export async function getFormattedNotifications(): Promise<NotificationGroup[]> {
  try {
    const token = useAuthStore.getState().token;
    const response = await axios.get<ApiNotiResponse>(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/user/notification?page=0&size=10`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const notifications: Notification[] = response.data.data.content.map(n => {
      // Lấy tên người gửi từ đầu content (trước dấu cách đầu tiên)
      const firstSpaceIndex = n.content.indexOf(' ');
      const userNameFromContent =
        firstSpaceIndex > 0 ? n.content.slice(0, firstSpaceIndex) : n.content;

      return {
        id: n.id.toString(),
        avatarUrl: images.sampleAvatar,
        userName: userNameFromContent,
        content: n.content.slice(firstSpaceIndex + 1).trim(),
        timestamp: dayjs(n.createdAt).format('HH:mm - DD/MM/YYYY'),
      };
    });


    // Phân nhóm "Hôm nay" và "Trước đó"
    const today = dayjs().format('YYYY-MM-DD');

    const groups: NotificationGroup[] = [
      {
        id: '1',
        title: 'Hôm nay',
        notifications: notifications.filter(n => n.timestamp.startsWith(today)),
      },
      {
        id: '2',
        title: 'Trước đó',
        notifications: notifications.filter(n => !n.timestamp.startsWith(today)),
      },
    ];

    return groups;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
}

export async function getPopularTopicsData(): Promise<Topic[]> {
  try {
    const token = useAuthStore.getState().token;

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/categories`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const apiData = response.data.data?.content ?? [];

    const sampleImages = [
      images.sampleFood1,
      images.sampleFood2,
      images.sampleFood3,
    ];

    return apiData.map((item: ApiTopic, index: number) => ({
      id: item.id.toString(),
      name: item.name,
      image: sampleImages[index % sampleImages.length],
    }));
  } catch (error) {
    console.error('Error fetching popular topics:', error);
    return [];
  }
}


export async function getSuggestedFriends() {
  const token = useAuthStore.getState().token;

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/user/follow/suggested`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const content = res.data.data?.content || [];

  // Random demo hashtags
  const hashtags = ['Chicken', 'Vegan', 'Eggs', 'Beef', 'Salad', 'Seafood'];
  const CHEF_TAGS = [
    " Bếp gia đình",
    " Đam mê ẩm thực",
    " Ăn healthy",
    " Món truyền thống",
    " Món Âu – Á fusion",
    " Gia vị chuẩn vị",
    " Nấu nhanh – gọn",
    " Bếp tại gia",
    " Ăn cay giỏi",
    " Mê bánh ngọt",
    " Nướng là chân ái",
    " Ẩm thực châu Á",
    " Yêu món Nhật",
    " Món Việt chuẩn vị",
    " Hay sáng tạo món mới",
  ];
  const getRandomChefTags = (min = 1, max = 2) => {
    const shuffled = [...CHEF_TAGS].sort(() => 0.5 - Math.random());
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    return shuffled.slice(0, count);
  };

  // Format dữ liệu về dạng mock
  const formatted = content.map((u: any) => ({
    id: u.id.toString(),
    name: u.username,
    commonFriends: getRandomChefTags(),
    hashtag: hashtags[Math.floor(Math.random() * hashtags.length)],
    avatarUrl: u.avatarUrl ?? null,
  }));

  return formatted;
}

export async function createRecipeComment(
  recipeId: number,
  payload: { content: string }
) {
  const token = useAuthStore.getState().token;
  return axios.post(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/recipes/${recipeId}/comments`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
}

export async function createReplyComment(
  parentCommentId: number,
  payload: { content: string }
) {
  const token = useAuthStore.getState().token;
  return axios.post(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/comments/${parentCommentId}/replies`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
}
export async function getIngredientNutrition(name: string) {
  // const Client_ID: "1a82434ec9444cef968d0505dc6766b1" ;
  // const Client_Secret: "1f7565aac0fc45d8bd65ac1e24811b50";
  // 1. Tìm ingredient ID
  const API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_KEY;

  const searchRes = await fetch(
    `https://api.spoonacular.com/food/ingredients/search?query=${encodeURIComponent(name)}&number=1&apiKey=${API_KEY}`
  );
  const searchData = await searchRes.json();
  if (!searchData.results || searchData.results.length === 0) {
    return { error: "Nguyên liệu không tìm thấy" };
  }

  const id = searchData.results[0].id;

  // 2. Lấy nutrition
  const nutritionRes = await fetch(
    `https://api.spoonacular.com/food/ingredients/${id}/information?amount=100&unit=gram&apiKey=${API_KEY}`
  );
  const nutritionData = await nutritionRes.json();

  return {
    calories: nutritionData.nutrition?.nutrients?.find((n: any) => n.name === "Calories")?.amount || 0,
    protein: nutritionData.nutrition?.nutrients?.find((n: any) => n.name === "Protein")?.amount || 0,
    carbs: nutritionData.nutrition?.nutrients?.find((n: any) => n.name === "Carbohydrates")?.amount || 0,
    fat: nutritionData.nutrition?.nutrients?.find((n: any) => n.name === "Fat")?.amount || 0,
  };
}

const ApiHome = {
  login,
  signUp,
  getRecipesFollowing,
  getRecipesDetail,
  getRecipesComment,
  getReplyComment,
  getMyCollection,
  getMyRecipe,
  getLikedRecipes,
  getIngredientsData,
  getRecipesBySearch,
  getFormattedNotifications,
  getPopularTopicsData,
  getSuggestedFriends,
  createRecipeComment,
  createReplyComment,
  getIngredientNutrition,
  getUserById,
  getUserCollection,
  getUserRecipe,
  getRecipesHistory,
  getRecipesByCate,
  getRecipesLike,
  getRecipesView
};

export default ApiHome;

