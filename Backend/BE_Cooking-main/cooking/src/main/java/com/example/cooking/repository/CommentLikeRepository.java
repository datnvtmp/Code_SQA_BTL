package com.example.cooking.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.example.cooking.model.CommentLike;
import com.example.cooking.model.User;
import com.example.cooking.dto.projection.LikeCountCommentProjection;
import com.example.cooking.model.Comment;

@Repository
public interface CommentLikeRepository extends JpaRepository<CommentLike, Long> {    
    boolean existsByUserAndComment(User user, Comment comment);
    // //TODO: QUAN TRONG
    // // long deleteByUserIdAndCommentId(Long userId, Long commentId); thi loi, xem lai van de
    // Integer deleteByUserIdAndCommentId(Long userId, Long commentId);
    @Modifying
    @Query("DELETE FROM CommentLike cl WHERE cl.user.id = :userId AND cl.comment.id = :commentId")
    int deleteByUserIdAndCommentId(@Param("userId") Long userId, @Param("commentId") Long commentId);

    @Query("""
            SELECT 
                cl.comment.id AS commentId,
                COUNT(cl.id) AS likeCount,
                SUM(CASE WHEN cl.user.id = :userId THEN 1 ELSE 0 END) > 0 AS likedByUser
            FROM CommentLike cl
            WHERE cl.comment.id IN :commentIds
            GROUP BY cl.comment.id
            """)
    List<LikeCountCommentProjection> countLikesByCommentIds(@Param("commentIds")List<Long> commentIds, @Param("userId") Long userId);
}
