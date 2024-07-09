import React, { useState } from 'react';
import { FaStar, FaRegStar } from "react-icons/fa";
import styles from './PostList.module.css';

interface PostDetails {
    postId: number;
    postContent: string;
    ratingStar: number;
}

interface PostListProps {
    posts: PostDetails[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
    const [expandedPost, setExpandedPost] = useState<number | null>(null);

    const renderStars = (ratingStar: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= ratingStar) {
                stars.push(<FaStar key={i} className={styles.star} />);
            } else {
                stars.push(<FaRegStar key={i} className={styles.star} />);
            }
        }
        return stars;
    };

    const toggleExpand = (postId: number) => {
        setExpandedPost(expandedPost === postId ? null : postId);
    };

    return (
        <div className={styles.postsList}>
            {posts.map((post) => (
                <div 
                    key={post.postId} 
                    className={`${styles.post} ${expandedPost === post.postId ? styles.expanded : ''}`} 
                    onClick={() => toggleExpand(post.postId)}
                >
                    <div className={styles.postHeader}>
                        {renderStars(post.ratingStar)}
                    </div>
                    <div className={styles.postContent}>
                        {expandedPost === post.postId ? post.postContent : post.postContent.split('\n')[0]}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PostList;
