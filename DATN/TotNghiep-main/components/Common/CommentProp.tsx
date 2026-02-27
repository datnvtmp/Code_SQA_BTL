'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import LikeButton from '@/components/Common/LikeButton';
import { getReplyComment } from '@api/ApiHome';
import { Comment } from '@/types/type_index';
import { StaticImageData } from 'next/image';

interface Reply {
  id: number;
  user: string;
  avatar: string | StaticImageData; // ✅
  content: string;
  likes: number;
}

interface RepliesResponse {
  comments: Reply[];
  total: number;
}

interface CommentItemProps {
  comment: Comment;
  replycomment: number;
  showReplies: boolean;
  handleToggleReplies: (id: number) => void;
  onReply?: (parentId: number, content: string) => Promise<void>;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  replycomment,
  showReplies,
  handleToggleReplies,
  onReply,
}) => {
  const [replyContent, setReplyContent] = useState('');
  const [sending, setSending] = useState(false);
  const [localReplies, setLocalReplies] = useState<Reply[]>([]);

  const { data, isFetching, refetch } = useQuery<RepliesResponse>({
    queryKey: ['replyComments', comment.id],
    queryFn: () => getReplyComment(comment.id),
    enabled: showReplies,
    staleTime: 0,
  });

  // 🔥 Sync API replies → local state
  useEffect(() => {
    if (data?.comments) {
      setLocalReplies([...data.comments]);
    }
  }, [data]);
  console.log(localReplies)
  const handleSubmitReply = async () => {
    if (!replyContent.trim() || !onReply || sending) return;

    setSending(true);

    // 🔥 Optimistic reply
    const optimisticReply: Reply = {
      id: Date.now(),
      user: 'Bạn',
      avatar: comment.avatar,
      content: replyContent,
      likes: 0,
    };

    setLocalReplies(prev => [optimisticReply, ...prev]);
    setReplyContent('');

    try {
      await onReply(comment.id, replyContent);
      setTimeout(() => {
        refetch(); // sync lại với BE
      }, 300);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {comment.avatar && (
          <Image
            unoptimized
            src={comment.avatar}
            alt={comment.user}
            width={32}
            height={32}
            className="rounded-full object-cover w-8 h-8"
          />
        )}

        <div className="flex-1 flex flex-col gap-2">
          {/* COMMENT */}
          <div className="bg-white p-2 rounded-lg flex gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-black">
                  {comment.user}
                </span>
                <span className="text-xs text-gray-400">
                  {comment.date}
                </span>
              </div>
              <p className="text-sm text-black">{comment.content}</p>
            </div>

            <LikeButton
              recipeId={0}
              islike={false}
              initialLikes={comment.likes}
            />
          </div>

          {/* TOGGLE */}
          <button
            className="text-xs text-gray-500 flex items-center gap-1"
            onClick={() => handleToggleReplies(comment.id)}
          >
            <span className="w-4 h-px bg-gray-400" />
            {showReplies
              ? 'Ẩn phản hồi'
              : `Xem thêm ${replycomment || 0} phản hồi`}
          </button>

          {/* REPLIES */}
          {showReplies && (
            <div className="ml-6 flex flex-col gap-2">
              {isFetching && localReplies.length === 0 ? (
                <span className="text-xs text-gray-400">Đang tải...</span>
              ) : (
                <>
                  {localReplies.map(reply => (
                    <div
                      key={reply.id}
                      className="bg-gray-100 p-2 rounded-lg flex gap-2"
                    >
                      <Image
                        unoptimized
                        src={reply.avatar}
                        alt={reply.user}
                        width={24}
                        height={24}
                        className="rounded-full object-cover w-6 h-6"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-sm text-black">
                          {reply.user}
                        </span>
                        <p className="text-sm text-black">{reply.content}</p>
                      </div>
                      <LikeButton
                        recipeId={0}
                        islike={false}
                        initialLikes={reply.likes}
                      />
                    </div>
                  ))}

                  {/* INPUT */}
                  <div className="flex gap-2 mt-1">
                    <input
                      value={replyContent}
                      onChange={e => setReplyContent(e.target.value)}
                      placeholder="Viết phản hồi..."
                      className="flex-1 border px-3 py-1 rounded-lg text-sm"
                      disabled={sending}
                    />
                    <button
                      onClick={handleSubmitReply}
                      disabled={sending}
                      className="bg-customPrimary text-white px-3 py-1 rounded-lg text-sm disabled:opacity-60"
                    >
                      {sending ? '...' : 'Gửi'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
