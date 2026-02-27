import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

import CustomButton from '@/components/Common/CustomButton';
import { icons, images } from '@/constants';
import { getScaleFactor } from '@/lib/scaling';
import RecipeCarousel from '@/components/Common/RecipeCarousel';
import { useQuery } from '@tanstack/react-query';
import QUERY_KEY from '@api/QueryKey';
import ApiHome, { getReplyComment } from '@api/ApiHome';
import LikeButton from '@components/Common/LikeButton'
import SaveButton from '@components/Common/SaveButton'

import { useState } from 'react';
import CommentItem from '@components/Common/CommentProp';
import NutritionCalculatorPage from '@components/ai/page';




const MobileFoodDetailScreen = () => {
    const [showRepliesMap, setShowRepliesMap] = useState<Record<number, boolean>>({});
    const handleToggleReplies = (commentId: number) => {
        setShowRepliesMap(prev => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };

    const router = useRouter();

    const searchParams = useSearchParams();
    const idParam = searchParams.get('id');
    const recipeId = idParam ? parseInt(idParam, 10) : 1;

    // Recipe detail query
    const {
        data: postsDataDetail,
        isLoading: isLoadingDetail,
        isError: isErrorDetail,
        error: errorDetail,
    } = useQuery({
        queryKey: [QUERY_KEY.Recipes.GET_LIST_RECICPE + 'detail' + recipeId, recipeId],
        queryFn: () => ApiHome.getRecipesDetail(recipeId),
        staleTime: 1000 * 60 * 5,
    });
    // Recipe comments query
    const {
        data,
        isLoading: isLoadingComment,
        isError: isErrorComment,
        error: errorComment,
    } = useQuery({
        queryKey: [QUERY_KEY.Recipes.GET_LIST_RECICPE + 'comments', recipeId],
        queryFn: () => ApiHome.getRecipesComment(recipeId),
        staleTime: 1000 * 60 * 5,
    });

    // Loading / Error chung
    if (isLoadingDetail || isLoadingComment || !postsDataDetail || !data?.comments) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span>Đang tải...</span>
            </div>
        );
    }

    if (isErrorDetail || isErrorComment) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-500">
                <span>{(errorDetail as Error)?.message || (errorComment as Error)?.message}</span>
            </div>
        );
    }



    const scaleFactor = getScaleFactor();

    const allIngredients = postsDataDetail?.ingredients;

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <div className="overflow-y-auto pb-12">
                {/* Hero Image */}
                <div className="relative w-full h-[375px]">
                    <Image unoptimized
                        src={postsDataDetail.image}
                        alt={postsDataDetail.title}
                        fill
                        className="object-cover"
                        quality={100}
                        draggable={false}
                    />
                </div>

                {/* Header */}
                <div className="absolute top-0 left-0 right-0">
                    <div className="flex flex-row justify-between items-center h-11 px-4">
                        <button onClick={() => router.back()} className="bg-transparent border-none p-0 cursor-pointer">
                            <svg width={scaleFactor * 24} height={scaleFactor * 24} viewBox="0 0 24 24" fill="none">
                                <path d="M15 18l-6-6 6-6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <span className="font-bold text-white text-base">
                            Món ăn
                        </span>

                        <button className="bg-transparent border-none p-0 cursor-pointer">
                            <Image unoptimized
                                src={icons.threeDotsIcon}
                                alt="More options"
                                width={100}
                                height={100}
                                quality={100}
                                draggable={false}
                                className="object-contain h-6 w-auto brightness-0 invert"
                            />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className='bg-backgroundV1 p-4 space-y-6'>
                    {/* Food Detail */}
                    <div className="flex flex-col gap-4 pb-4 border-b border-[#979797]">
                        <span className="font-medium text-black text-2xl">
                            {postsDataDetail.title}
                        </span>

                        {/* Author Section */}
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row items-center gap-2">
                                <div className="relative w-10 h-10">
                                    <Image unoptimized
                                        src={postsDataDetail.author.avatar}
                                        alt={postsDataDetail.author.name}
                                        fill
                                        className="object-cover rounded-full border border-[#E36137]"
                                        quality={100}
                                        draggable={false}
                                    />
                                </div>
                                <div className="flex-1 flex flex-col gap-1">
                                    <span className="font-medium text-black text-sm">
                                        {postsDataDetail.author.name}
                                    </span>
                                    <div className="flex flex-row gap-2">
                                        <div className="flex flex-row items-center gap-1">
                                            <span className="font-medium text-black text-xs">
                                                {postsDataDetail.author.kitchenFriends}
                                            </span>
                                            <span className="text-textNeutralV1 text-xs">
                                                Bạn bếp chung
                                            </span>
                                        </div>
                                        <div className="flex flex-row items-center gap-1">
                                            <span className="font-medium text-textNeutralV1 text-xs">
                                                {postsDataDetail.author.hashtagCount}
                                            </span>
                                            <span className="text-xs text-[#00ACED]">
                                                #{postsDataDetail.author.hashtag}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button className="flex flex-row items-center bg-[#FFEFE9] px-3.5 py-1 rounded-lg gap-2">
                                    <Image unoptimized
                                        src={icons.check2Icon}
                                        alt="Check"
                                        width={100}
                                        height={100}
                                        quality={100}
                                        draggable={false}
                                        className="object-contain h-5 w-auto"
                                    />
                                    <span className="font-semibold text-customPrimary text-xs">
                                        Bạn bếp
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-1">
                            <span className="text-black text-base">
                                {postsDataDetail.description}
                            </span>
                            <div className="flex flex-row flex-wrap gap-2">
                                {postsDataDetail.hashtags.map((tag) => (
                                    <div key={tag} className="flex flex-row items-center">
                                        <span className="text-sm text-[#00ACED]">#</span>
                                        <span className="text-sm text-[#00ACED]">{tag}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Interaction Stats */}
                        <div className="flex flex-row justify-between items-center">
                            <div className="flex flex-row gap-3">
                                <LikeButton recipeId  ={postsDataDetail.author.id} islike={postsDataDetail.likedByCurrentUser} initialLikes={postsDataDetail.likes} />
                                <div className="flex flex-row items-center gap-1">
                                    <Image unoptimized
                                        src={icons.chatIcon}
                                        alt="Comments"
                                        width={100}
                                        height={100}
                                        quality={100}
                                        draggable={false}
                                        className="object-contain h-5 w-auto"
                                    />
                                    <span className="font-medium text-black text-sm">
                                        {data?.total}
                                    </span>
                                </div>
                            </div>
                            <SaveButton initialSaves={postsDataDetail.likes} />
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row justify-between items-center">
                            <span className="font-bold text-black text-base">
                                Bình luận
                            </span>
                            <span className="text-customPrimary text-sm">
                                Xem thêm
                            </span>
                        </div>

                        <div className="flex flex-col gap-2">
                            {data?.comments.map((comment) => (
                                <CommentItem
                                    key={comment.id}
                                    comment={comment}
                                    replycomment={comment.replyCount}
                                    showReplies={!!showRepliesMap[comment.id]}
                                    handleToggleReplies={handleToggleReplies}
                                />
                            ))}


                        </div>
                    </div>
                    {/* <NutritionCalculatorPage initialIngredients={allIngredients} /> */}


                    {/* Related Foods Section */}
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row justify-between items-center">
                            <span className="font-bold text-black text-base">
                                Có thể bạn cũng thích
                            </span>
                            
                        </div>

                        <RecipeCarousel />
                    </div>
                </div>
            </div>

            {/* Bottom Button */}
            <div className="fixed bottom-0 z-50 left-0 right-0 bg-white rounded-t-2xl py-2 px-4">
                <CustomButton
                    title="Xem công thức"
                    onPress={() => {
                        if (idParam) {
                            router.push(`/food-detail/materials?id=${idParam}`);
                        }
                    }}
                    bgVariant="primary"
                    textVariant="primary"
                    IconLeft={() => (
                        <Image unoptimized
                            src={icons.eyeIcon}
                            alt="View recipe"
                            width={100}
                            height={100}
                            quality={100}
                            draggable={false}
                            className="object-contain h-6 w-auto"
                        />
                    )}
                />
            </div>
        </div>
    );
};

export default MobileFoodDetailScreen;
