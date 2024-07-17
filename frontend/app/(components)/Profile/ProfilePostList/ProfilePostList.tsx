import React, { useState, useEffect, useRef } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ProfilePostList.module.css";
import { PostDetails } from "@/(types)/types";

interface PostListProps {
    posts: PostDetails[];
}

const ProfilePostList: React.FC<PostListProps> = ({ posts }) => {
    const [expandedPost, setExpandedPost] = useState<number | null>(null);
    const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const postGroups = [];
    for (let i = 0; i < posts.length; i += 5) {
        postGroups.push(posts.slice(i, i + 5));
    }

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

    const handleScroll = (event: React.WheelEvent<HTMLDivElement>) => {
        const { deltaY } = event;
        if (deltaY > 0 && currentGroupIndex < postGroups.length - 1) {
            setCurrentGroupIndex(currentGroupIndex + 1);
        } else if (deltaY < 0 && currentGroupIndex > 0) {
            setCurrentGroupIndex(currentGroupIndex - 1);
        }
    };

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = 0;
        }
    }, [currentGroupIndex]);

    return (
        <div className={styles.postsList} ref={containerRef} onWheel={handleScroll}>
            <AnimatePresence>
                {postGroups[currentGroupIndex]?.map((post) => (
                    <motion.div
                        key={post.postId}
                        className={`${styles.post} ${
                            expandedPost === post.postId ? styles.expanded : ""
                        }`}
                        onClick={() => toggleExpand(post.postId)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className={styles.postHeader}>
                            {renderStars(post.ratingStar)}
                        </div>
                        <div className={styles.postNick}>
                            {post.memberNick}
                        </div>
                        <div className={styles.postContent}>
                            {expandedPost === post.postId
                                ? post.postContent
                                : post.postContent
                                    ? post.postContent.split("\n")[0]
                                    : ""}
                        </div>
                        <div>{post.regDate}</div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ProfilePostList;