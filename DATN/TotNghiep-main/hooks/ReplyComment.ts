import { useQuery } from '@tanstack/react-query';
import { getReplyComment } from '@api/ApiHome'; // giả sử hàm bạn viết ở đây

export const useReplyComment = (parentCommentId: number, enabled = false) => {
  return useQuery({
    queryKey: ['replyComments', parentCommentId],
    queryFn: () => getReplyComment(parentCommentId),
    enabled, // chỉ fetch khi click
    staleTime: 1000 * 60 * 5,
  });
};
