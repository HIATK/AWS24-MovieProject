import React from 'react';
import styles from "./PostList.module.css";
import { PostDetails } from "@/(types)/types";

interface PostListProps {
    posts: PostDetails[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
    return (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>내가 남긴 리뷰</h2>
            <div>
                {posts !== null && posts.map((post) => (
                    <div key={post.postId}>
                        {post.postContent} /
                        Rating: {post.ratingStar} /
                        Posted on: {post.regDate}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostList;