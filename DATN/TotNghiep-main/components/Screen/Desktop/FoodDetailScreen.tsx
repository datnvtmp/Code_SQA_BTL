'use client';
import Fuse from 'fuse.js';

import CustomButton from '@/components/Common/CustomButton';
import { icons } from '@/constants';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import RecipeCarousel from '../../Common/RecipeCarousel';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import QUERY_KEY from '@api/QueryKey';
import ApiHome from '@api/ApiHome';
import { getScaleFactor } from '@/lib/scaling';

import LikeButton from '@components/Common/LikeButton';
import SaveButton from '@components/Common/SaveButton';
import CommentItem from '@components/Common/CommentProp';
import { useState, useEffect } from 'react';
import { ingredientsList, unitMap } from '@utils/ingredients-list';
import NutritionCalculatorPage from '@components/ai/page';
import RecipeCarousel2 from '@components/Common/RecipeCarousel2';
type Reply = {
    id: number;
    content: string;
    author: { name: string; avatar: string };
};

const FoodDetailScreen = () => {
    const [showRepliesMap, setShowRepliesMap] = useState<Record<number, boolean>>({});
    const [newComment, setNewComment] = useState("");
    const [commentsList, setCommentsList] = useState<any[]>([]);

    const router = useRouter();
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();
    const idParam = searchParams.get('id');
    const recipeId = idParam ? parseInt(idParam, 10) : 1;

    const handleToggleReplies = (commentId: number) => {
        setShowRepliesMap(prev => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };

    // ============================
    // Fetch Recipe Detail
    // ============================
    const {
        data: postsDataDetail,
        isLoading: isLoadingDetail,
        isError: isErrorDetail,
        error: errorDetail,
    } = useQuery({
        queryKey: ['detail' + recipeId, recipeId],
        queryFn: () => ApiHome.getRecipesDetail(recipeId),
        staleTime: 1000 * 60 * 5,
    });

    const allIngredients = postsDataDetail?.ingredients;
    // ============================
    // Fetch Comments
    // ============================
    const COMMENTS_QUERY_KEY = ['comments', recipeId];

    const {
        data,
        isLoading: isLoadingComment,
        isError: isErrorComment,
        error: errorComment,
    } = useQuery({
        queryKey: COMMENTS_QUERY_KEY,
        queryFn: () => ApiHome.getRecipesComment(recipeId),
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if (data?.comments) {
            // tránh setState đồng bộ gây cascading renders
            setTimeout(() => setCommentsList(data.comments), 0);
        }
    }, [data?.comments]);

    // ============================
    // Mutation: Create Comment
    // ============================
    const createCommentMutation = useMutation({
        mutationFn: (payload: { content: string }) =>
            ApiHome.createRecipeComment(recipeId, payload),
        onMutate: async (newCommentPayload) => {
            const tempId = Math.random();
            const tempComment = {
                id: tempId,
                content: newCommentPayload.content,
                author: {
                    name: 'Bạn',
                    avatar: '/avatar-placeholder.png',
                },
                replyCount: 0,
            };
            setCommentsList(prev => [tempComment, ...prev]);
            return { tempId };
        },
        onError: (err, newCommentPayload, context) => {
            setCommentsList(prev => prev.filter(c => c.id !== context?.tempId));
        },
        onSuccess: (res, newCommentPayload, context) => {
            // Replace temp comment with server comment
            setCommentsList(prev =>
                prev.map(c => (c.id === context?.tempId ? res : c))
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: COMMENTS_QUERY_KEY });
        },
    });

    // ============================
    // Mutation: Create Reply
    // ============================
    const createReplyMutation = useMutation({
        mutationFn: (payload: { parentId: number; content: string }) =>
            ApiHome.createReplyComment(payload.parentId, { content: payload.content }),
        onMutate: async ({ parentId, content }) => {
            const tempId = Math.random();
            setCommentsList(prev =>
                prev.map(comment =>
                    comment.id === parentId
                        ? {
                            ...comment,
                            replies: [
                                ...(comment.replies || []),
                                {
                                    id: tempId,
                                    content,
                                    author: { name: 'Bạn', avatar: '/avatar-placeholder.png' },
                                } as Reply,
                            ],
                            replyCount: (comment.replyCount || 0) + 1,
                        }
                        : comment
                )
            );

            // Mở luôn phần replies của comment
            setShowRepliesMap(prev => ({ ...prev, [parentId]: true }));

            return { parentId, tempId };
        },

        onError: (_, __, context) => {
            setCommentsList(prev =>
                prev.map(comment =>
                    comment.id === context?.parentId
                        ? {
                            ...comment,
                            replies: (comment.replies || []).filter(
                                (r: Reply) => r.id !== context?.tempId
                            ),
                            replyCount: (comment.replyCount || 1) - 1,
                        }
                        : comment
                )
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: COMMENTS_QUERY_KEY });
        },
    });

    const handleReplySubmit = async (parentId: number, content: string) => {
        if (!content.trim()) return;

        await createReplyMutation.mutateAsync({
            parentId,
            content,
        });
    };


    // ============================
    // Loading + Error
    // ============================
    if (isLoadingDetail || isLoadingComment || !postsDataDetail || !commentsList) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span>Đang tải...</span>
            </div>
        );
    }

    if (isErrorDetail || isErrorComment) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-500">
                <span>
                    {(errorDetail as Error)?.message || (errorComment as Error)?.message}
                </span>
            </div>
        );
    }

    const scaleFactor = getScaleFactor();

    // ============================
    // MAIN RETURN
    // ============================
    return (
        <div className="min-h-dvh w-full bg-[#FAFAFA]">
            <div className="mx-auto max-w-[1440px]">

                {/* ===================== BANNER ===================== */}
                <div className="relative w-full h-[420px] overflow-hidden bg-black">
                    {/* Background blur */}
                    <Image
                        unoptimized
                        src={postsDataDetail.image && typeof postsDataDetail.image === 'string' && postsDataDetail.image.trim() !== '' && !postsDataDetail.image.includes('bit.ly') ? postsDataDetail.image : '/assets/images/sample-food3.jpg'}
                        alt=""
                        fill
                        priority
                        className="object-cover blur-2xl scale-110 opacity-40"
                    />

                    {/* Main image */}
                    <div className="relative z-10 flex h-full items-center justify-center">
                        <Image
                            unoptimized
                            src={postsDataDetail.image && typeof postsDataDetail.image === 'string' && postsDataDetail.image.trim() !== '' && !postsDataDetail.image.includes('bit.ly') ? postsDataDetail.image : '/assets/images/sample-food3.jpg'}
                            alt={postsDataDetail.title}
                            width={420}
                            height={420}
                            priority
                            quality={90}
                            className="object-contain rounded-2xl shadow-2xl"
                        />
                    </div>

                    {/* Header overlay */}
                    <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center text-white">
                        <button onClick={() => router.back()}>
                            <Image src={icons.backArrow} alt="back" width={24} height={24} />
                        </button>

                        <p className="font-bold text-base">{postsDataDetail.title}</p>

                        <button>
                            <Image src={icons.threeDotsIcon} alt="menu" width={24} height={24} />
                        </button>
                    </div>
                </div>

                {/* ===================== MAIN CONTENT ===================== */}
                <div className="grid grid-cols-12 gap-10 px-16 py-10">

                    {/* LEFT – CONTENT */}
                    <div className="col-span-8 flex flex-col gap-6">

                        {/* Author */}
                        <div className="flex items-center gap-4">
                            <Image
                                unoptimized
                                src={postsDataDetail.author?.avatar && typeof postsDataDetail.author.avatar === 'string' && postsDataDetail.author.avatar.trim() !== '' && !postsDataDetail.author.avatar.includes('bit.ly') ? postsDataDetail.author.avatar : '/assets/images/sample-avatar.png'}
                                alt={postsDataDetail.author.name}
                                width={56}
                                height={56}
                                className="rounded-full object-cover border border-[#E36137]"
                            />

                            <div className="flex flex-col">
                                <p className="font-semibold text-lg text-black">
                                    {postsDataDetail.author.name}
                                </p>

                                <div className="flex gap-4 text-sm text-gray-500">
                                    <span>
                                        <b className="text-black">{postsDataDetail.author.kitchenFriends}</b> bạn bếp chung
                                    </span>
                                    <span className="text-[#00ACED]">
                                        #{postsDataDetail.author.hashtag}
                                    </span>
                                </div>
                            </div>

                            <button className="ml-auto bg-[#FFEFE9] px-4 py-2 rounded-lg flex items-center gap-2">
                                <Image src={icons.check2Icon} alt="friend" width={18} height={18} />
                                <span className="font-semibold text-customPrimary text-sm">
                                    Bạn bếp
                                </span>
                            </button>
                        </div>

                        {/* Description */}
                        <p className="text-lg text-gray-800 leading-relaxed">
                            {postsDataDetail.description}
                        </p>

                        {/* Hashtags */}
                        <div className="flex flex-wrap gap-2">
                            {postsDataDetail.hashtags.map(tag => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 rounded-full bg-blue-50 text-blue-500 text-sm"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center gap-6">
                                <LikeButton
                                    islike={postsDataDetail.likedByCurrentUser}
                                    initialLikes={postsDataDetail.likes}
                                    recipeId={postsDataDetail.id}
                                />

                                <div className="flex items-center gap-2">
                                    <Image
                                        src={icons.chatIcon}
                                        alt="comments"
                                        width={18}
                                        height={18}
                                    />
                                    <span className="text-sm font-medium">
                                        {commentsList.length}
                                    </span>
                                </div>
                            </div>

                            <SaveButton initialSaves={postsDataDetail.likes} />
                        </div>
                    </div>

                    {/* RIGHT – COMMENTS */}
                    <div className="col-span-4 bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <p className="font-bold text-lg">Bình luận</p>
                            <button className="text-customPrimary text-sm">Xem thêm</button>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Viết bình luận..."
                                className="flex-1 border border-gray-300 px-3 py-2 rounded-lg"
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                            />
                            <button
                                onClick={() => {
                                    if (!newComment.trim()) return;
                                    createCommentMutation.mutate({ content: newComment });
                                    setNewComment("");
                                }}
                                className="bg-customPrimary text-white px-4 py-2 rounded-lg"
                            >
                                Gửi
                            </button>
                        </div>

                        <div className="flex flex-col gap-3 overflow-y-auto max-h-[520px]">
                            {commentsList.map((comment, index) => (
                                <CommentItem
                                    key={`${comment.id}-${index}`}
                                    comment={comment}
                                    replycomment={comment.replyCount}
                                    showReplies={!!showRepliesMap[comment.id]}
                                    handleToggleReplies={handleToggleReplies}
                                    onReply={handleReplySubmit}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* ===================== RELATED ===================== */}
                <div className="px-16 pb-12">
                    <div className="flex justify-between items-center mb-4">
                        <p className="font-bold text-xl">Có thể bạn cũng thích</p>
                    </div>

                    <RecipeCarousel2 user_id={postsDataDetail.author.id} />
                </div>

                {/* CTA */}
                <div className="flex justify-center pb-16">
                    <CustomButton
                        title="Xem công thức"
                        onPress={() => router.push(`/food-detail/materials?id=${idParam}`)}
                        bgVariant="primary"
                        textVariant="primary"
                        className="!w-fit"
                        IconLeft={<Image src={icons.eyeIcon} alt="view" width={22} height={22} />}
                    />
                </div>
            </div>
        </div>
    );

};

export default FoodDetailScreen;
