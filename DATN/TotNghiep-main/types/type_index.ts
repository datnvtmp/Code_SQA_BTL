import { StaticImageData } from 'next/image';
export interface Role {
  name: string;
}

export interface User {
  id: number;
  username: string;
  dob: string;
  bio: string;
  avatarUrl: string;
  roles: Role[];
  createdAt: string;
  lastLogin: string;
}
export interface UserResponse {
  status: number;
  message: string;
  data: User;
  timestamp: string;
}
export interface ILoginResponse {
  status: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      username: string;
      dob: string;
      bio: string;
      avatarUrl: string;
      roles: { name: string }[];
      createdAt: string;
      lastLogin: string;
    };
  };
  timestamp: string;
}


export interface ILoginPayload {
  email: string;
  password: string;
}

export interface ISignUpPayload {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  bio?: string;
  dob?: string; // "YYYY-MM-DD"
  avatarUrl?: string;
}

export interface ISignUpResponse {
  status: number;
  message: string;
  data: string;
  timestamp: string;
}

export interface PostItemProps {
  item: {
    id: string;
    user: {
      id: number;
      name: string;
      timeAgo: string;
      avatar:string;
    };
    content: {
      title: string;
      description: string;
      hashtags: string[];
      likes: number;
      comments: number;
      image: StaticImageData | string;
      liked: boolean;
      likedByCurrentUser: boolean,
      savedByCurrentUser: boolean,
    };
  };
}


export interface SuggestedFriendItemProps {
  item: {
    id: string;
    name: string;
    commonFriends: string[];
    hashtag: string;
    avatarUrl:string;
  };
}


export interface FoodDetailData {
  id: number;
  title: string;
  author: {
    id:number
    name: string;
    avatar: string;
    kitchenFriends: number;
    hashtag: string;
    hashtagCount: number;
  };
  description: string;
  hashtags: string[];
  comments: number;
  likes: number;
  saves: number;
  image: string;
  video: string;
  likedByCurrentUser: boolean;
  ingredients: []
}

export interface Comment {
  id: number;
  user: string;
  avatar: string | StaticImageData; // nếu dùng Image từ next/image, có thể là StaticImageData
  date: string;
  content: string;
  likes: number;
  replies: number;
  replyCount: number;
}

export interface Reply {
  id: number;
  user: string;
  avatar: string;
  content: string;
  likes: number;
  date: string; // ngày tạo phản hồi
}

export interface ReplyComment {
  comments: Reply[];
  total: number; // tổng số phản hồi (nếu API trả về)
}
export interface CollectionItem {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  recipeCount: number;
  user: User;
  public: boolean;
}

export interface CollectionResponse {
  status: number;
  message: string;
  data: {
    content: CollectionItem[];
    totalElements: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  timestamp: string;
}

export interface Recipe {
  id: number;
  title: string;
  description: string;
  image: any; // hoặc string
  imageUrl: any
  comments: number;
  saves: number;
  views: number;
  time: string;
}


export interface RecipeApiItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  prepTime: number;
  cookTime: number;
  difficulty: string;
  servings: number;
  scope: string;
  status: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  categories: any[];
  tags: any[];
  user: User;
  likeCount: number;
  commentCount: number;
  likedByCurrentUser: boolean;
  saveCount: number;
  savedByCurrentUser: boolean;
}

export interface RecipeApiResponse {
  status: number;
  message: string;
  data: {
    content: RecipeApiItem[];
    totalElements: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  timestamp: string;
}

export interface RecipeItem {
  id: number;
  title: string;
  description: string;
  likes: number;
  comments: number;
  saves: number;
  time: string;
  images: any[]; // hoặc string[]
}


export interface LikedRecipe {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  prepTime: number;
  cookTime: number;
  difficulty: string;
  servings: number;
  scope: string;
  status: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  categories: any[];
  tags: any[];
  user: User;
  likeCount: number;
  commentCount: number;
  likedByCurrentUser: boolean;
  saveCount: number;
  savedByCurrentUser: boolean;
}

export interface LikedRecipesResponse {
  status: number;
  message: string;
  data: {
    content: LikedRecipe[];
    totalElements: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  timestamp: string;
}

export interface FormattedRecipeItem {
  id: number;
  title: string;
  views: number;
  time: string;
  images: string[];
  likes: number;
  comments: number;
  saves: number;
}


export interface Step {
  stepNumber: number;
  description: string;
  imageUrls: string[];
}

export interface IngredientItem {
  quantity: number;
  unit: string;
  rawName: string;
  displayOrder: number;
}



export interface RecipeHaveIngredient {
  id: number;
  title: string;
  description: string;
  image: string;
  ingredients: IngredientItem[];
  steps: StepItem[];
  user: any;
  videoUrl: string;
  imageUrl:string;
}

export interface RecipeDetailResponse {
  status: number;
  message: string;
  data: RecipeHaveIngredient;  // Recipe chứa ingredients
  timestamp: string;
}


export interface StepItem {
  stepNumber: string | number;
  title: string;
  description: string;
  isCompleted?: boolean; // có thể optional
  showLine?: boolean;
  imageUrls: []  // có thể optional
}

interface CookingStepTabProps {
  steps: StepItem[];
  onMasterChefPress?: () => void;
}


export interface SuggestedTopic {
  id: string | number;
  name: string;
  image: string;
}


export interface Notification {
  id: string;
  avatarUrl: string | StaticImageData; // nếu dùng Next.js Image
  userName: string;
  content: string;
  timestamp: string;
}

export interface NotificationGroup {
  id: string;
  title: string;
  notifications: Notification[];
}

export interface ApiNotification {
  id: number;
  type: string;
  content: string;
  createdAt: string;
  recipeId: number | null;
  commentId: number | null;
  actorId: number;
  read: boolean;
}

export interface ApiNotiResponse {
  status: number;
  message: string;
  data: {
    content: ApiNotification[];
    totalElements: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  timestamp: string;
}


export interface ApiTopic {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
}

export interface Topic {
  id: string;
  name: string;
  image: string | StaticImageData; // cho phép dùng cả string và image import
}