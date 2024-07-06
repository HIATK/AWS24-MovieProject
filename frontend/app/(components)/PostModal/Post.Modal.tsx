import React, { useState } from "react";
import styles from "./Post.Modal.module.css";
import PostWriteModal from "./PostWriteModal";
import { FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import Board from "../board/board";

interface ModalProps {
  onClose: () => void;
}

interface Post {
  content: string;
  file: string | null;
  rating: number;
}

const Modal: React.FC<ModalProps> = ({ onClose }) => {
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [liked, setLiked] = useState(false);
  const postsPerPage = 4;

  const openWriteModal = () => {
    setIsWriteModalOpen(true);
  };

  const closeWriteModal = () => {
    setIsWriteModalOpen(false);
  };

  const openBoardModal = (post: Post) => {
    setSelectedPost(post);
    setIsBoardModalOpen(true);
  };

  const closeBoardModal = () => {
    setIsBoardModalOpen(false);
  };

  const addPost = (post: Post) => {
    setPosts([...posts, post]);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleLike = () => {
    setLiked(!liked);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const pageNumbers = Array.from(
    { length: Math.ceil(posts.length / postsPerPage) },
    (_, i) => i + 1
  );

  return (
    <div className={styles.modalOverlay}>
      <motion.div
        className={styles.modalContent}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
        <div className={styles.content}>
          <div className={styles.header}>
            <img
              src="/images/koko.jpg"
              alt="Poster"
              className={styles.poster}
            />
            <div className={styles.movieInfo}>
              <h1>퓨리오사: 매드맥스 사가(2024)</h1>
              <h2>2024/05/22(KR) · 액션, 모험, SF · 2h 29m</h2>
              <p>
                문명 붕괴 45년 후, 황폐해진 세상 속 누구에게도 알려지지 않은
                풍요가 가득한 녹색의 땅에서 자란 퓨리오사는 바이커 군단의 폭군
                디멘투스의 손에 모든 것을 잃고 만다. 가족도 행복도 모두 빼앗기고
                세상에 홀로 내던져진 퓨리오사는 반드시 고향으로 돌아가겠다는
                어머니와의 약속을 지키기 위해 인생 전부를 건 복수를
                시작하는데...
              </p>
              <button
                className={`${styles.likeButton} ${liked ? styles.liked : ""}`}
                onClick={handleLike}
              >
                <FaHeart /> {liked ? "좋아요 취소" : "좋아요"}
              </button>
            </div>
          </div>
          <div className={styles.comments}>
            <div className={styles.commentHeader}>
              게시글
              <button onClick={openWriteModal} className={styles.writeButton}>
                새 게시글
              </button>
            </div>
            {currentPosts.map((post, index) => (
              <div key={index} className={styles.comment}>
                <button
                  onClick={() => openBoardModal(post)}
                  className={styles.postButton}
                >
                  ID(사용자): {post.content.slice(0, 8)}
                </button>
              </div>
            ))}
          </div>
          {posts.length > postsPerPage && (
            <div className={styles.pagination}>
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={styles.pageButton}
                >
                  {number}
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
      {isWriteModalOpen && (
        <PostWriteModal
          onClose={closeWriteModal}
          addPost={(newPost) => {
            addPost(newPost);
            closeWriteModal();
          }}
        />
      )}
      {isBoardModalOpen && selectedPost && (
        <Board post={selectedPost} onClose={closeBoardModal} />
      )}
    </div>
  );
};

export default Modal;
