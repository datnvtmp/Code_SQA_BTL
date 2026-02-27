import { FoodDetailData, Comment, ReplyComment, Reply, CollectionResponse, Recipe, CollectionItem, RecipeApiResponse, RecipeItem, RecipeApiItem, LikedRecipesResponse, FormattedRecipeItem, LikedRecipe } from '@/types/type_index';
import { images, videos } from '@constants/index';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

// Nếu có PostItemProps thì import đúng path của bạn
// import { PostItemProps } from '@/types/post-item';

export function mapRecipeToPostItem(item: any) {
  return {
    id: String(item.id),
    user: {
      id : item.user?.id,
      name: item.user?.username || 'Unknown',
      timeAgo: formatDistanceToNow(new Date(item.createdAt), {
        addSuffix: true,
        locale: vi,
      }),
      avatar: item.user?.avatarUrl
    },
    content: {
      title: item.title,
      description: item.description,
      hashtags: item.tags?.map((t: any) => t.name) || [],
      likes: item.likeCount,
      comments: item.commentCount,
      image: item.imageUrl,
      likedByCurrentUser : item.likedByCurrentUser,
      savedByCurrentUser : item.savedByCurrentUser
    },
  };
}

export function mapApiToFoodDetail(apiData: any): FoodDetailData {
  return {
    id: apiData.id,
    title: apiData.title,
    author: {
      id:apiData.user?.id || 0,
      name: apiData.user?.username || 'Unknown',
      avatar: apiData.user?.avatarUrl || images.sampleAvatar,
      kitchenFriends: 28, // giả lập nếu API không có
      hashtag: apiData.tags?.[0]?.name || '',
      hashtagCount: apiData.tags?.length || 0,
    },
    description: apiData.description,
    hashtags: apiData.tags?.map((tag: any) => tag.name) || [],
    comments: 1, // giả lập nếu API không có
    likes: apiData.likeCount,
    saves: apiData.saveCount || 0,
    image: apiData.imageUrl || images.sampleFood1,
    video: apiData.videoUrl || videos.videoTutorial,
    likedByCurrentUser: apiData.likedByCurrentUser,
    ingredients : apiData.ingredients
  };
}

export function mapApiToComments(apiData: any): Comment[] {
  return apiData.content.map((c: any) => ({
    id: c.id,
    user: c.user.username,
    avatar: c.user.avatarUrl,
    content: c.content,
    replyCount: c.replyCount,
    likes: c.likeCount,
    likedByMe: c.likedByCurrentUser,
    createdAt: c.createdAt,
  }));
}


export function mapApiToReplyComment(apiData: any): ReplyComment {
  const apiComments = apiData?.content || [];

  const comments: Reply[] = apiComments.map((c: any) => ({
    id: c.id,
    user: typeof c.user === "string" ? c.user : c.user.username,
    avatar: c.user.avatarUrl || images.sampleAvatar,
    content: c.content || c.text || "",
    likes: c.likes || 0,
    date: c.date || c.createdAt || "",
  }));

  return {
    comments,
    total: comments.length,
  };
}



export function convertCollectionsToRecipes(collectionResponse: CollectionResponse): Recipe[] {
  return collectionResponse.data.content.map((collection: CollectionItem, index: number) => {
    const sampleImages = [images.sampleFood1, images.sampleFood2, images.sampleFood3];
    const image = sampleImages[index % sampleImages.length];

    return {
      id: collection.id,
      title: collection.name,
      description: collection.description,
      image: image,
      comments: Math.floor(Math.random() * 50),
      saves: collection.recipeCount,
      views: Math.floor(Math.random() * 100),
      time : calculateTimeAgo(collection.createdAt)
    };
  });
}

export function convertApiRecipesToRecipeItems(apiResponse: RecipeApiResponse): RecipeItem[] {
  return apiResponse.data.content.map((recipe: RecipeApiItem) => {
    // Tính tổng thời gian (prepTime + cookTime) và format thành string
    const totalTime = recipe.prepTime + recipe.cookTime;
    const timeString = formatTime(totalTime);

    return {
      id: recipe.id,
      title: recipe.title,
      likes: recipe.likeCount,
      comments: recipe.commentCount,
      saves: recipe.saveCount,
      time: timeString,
      description:recipe.description,
      images: [recipe.imageUrl] // Chuyển imageUrl thành mảng images
    };
  });
}

export function formatLikedRecipes(response: LikedRecipesResponse): FormattedRecipeItem[] {
  return response.data.content.map((recipe: LikedRecipe) => {
    const totalTime = recipe.prepTime + recipe.cookTime;
    const timeString = formatTime(totalTime);

    return {
      id: recipe.id,
      title: recipe.title,
      views: recipe.views,
      time: timeString,
      images: [recipe.imageUrl],
      likes: recipe.likeCount,
      comments: recipe.commentCount,
      saves: recipe.saveCount
    };
  });
}


// Hàm format thời gian
function formatTime(totalMinutes: number): string {
  if (totalMinutes < 60) {
    return `${totalMinutes} phút`;
  } else if (totalMinutes < 1440) { // 24 giờ
    const hours = Math.floor(totalMinutes / 60);
    return `${hours} giờ`;
  } else {
    const days = Math.floor(totalMinutes / 1440);
    return `${days} ngày`;
  }
}

// utils/timeUtils.ts
export function calculateTimeAgo(createdAt: string): string {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const diffInMs = now.getTime() - createdDate.getTime();
  
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays > 0) {
    return `${diffInDays} ngày trước`;
  } else if (diffInHours > 0) {
    return `${diffInHours} giờ trước`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} phút trước`;
  } else {
    return 'Vừa xong';
  }
}

