import React, { useState, useEffect, useRef } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./PostList.module.css";
import { PostDetails } from "@/(types)/types";

interface PostListProps {
  posts: PostDetails[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [displayedPosts, setDisplayedPosts] = useState<PostDetails[]>([]);
  const [postIndex, setPostIndex] = useState(5);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (displayedPosts.length === 0 && posts.length > 0) {
      const initialPosts = posts.slice(0, 5);
      setDisplayedPosts(initialPosts);
    } else {
      setTimeout(() => {
        const newPosts = posts.slice(0, postIndex);
        setDisplayedPosts(newPosts);
      }, 1);
    }
  }, [posts, postIndex]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMorePosts();
        }
      },
      {
        threshold: 1.0,
      }
    );

    if (observerRef.current) {
      observer.current.observe(observerRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [displayedPosts]);

  const loadMorePosts = () => {
    const newPosts = posts.slice(postIndex, postIndex + 5);
    setDisplayedPosts((prevPosts) => [...prevPosts, ...newPosts]);
    setPostIndex((prevIndex) => prevIndex + 5);
  };

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
      <AnimatePresence>
        {displayedPosts.map((post) => (
          <motion.div
            key={post.postId}
            className={`${styles.post} ${
              expandedPost === post.postId ? styles.expanded : ""
            }`}
            onClick={() => toggleExpand(post.postId)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
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
      <div ref={observerRef} className={styles.observer} />
    </div>
  );
};

export default PostList;
