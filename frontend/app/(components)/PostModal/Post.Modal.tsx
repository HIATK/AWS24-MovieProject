import React, { useState } from "react";
import styles from "./Post.Modal.module.css";
import PostWriteModal from "./PostWriteModal";
import { FaHeart } from "react-icons/fa"; // 좋아요 아이콘 추가

interface ModalProps {
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ onClose }) => {
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [posts, setPosts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4; // 페이지당 게시글 수

  const openWriteModal = () => {
    setIsWriteModalOpen(true);
  };

  const closeWriteModal = () => {
    setIsWriteModalOpen(false);
  };

  const addPost = (post: string) => {
    setPosts([...posts, post]);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Calculate current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
        <div className={styles.content}>
          <div className={styles.background}>
            <div className={styles.overlay}></div>
            <img
              src="/images/qwer.jpg"
              alt="Background"
              className={styles.backgroundImage}
            />
          </div>
          <div className={styles.header}>
            <img
              src="/images/koko.jpg"
              alt="Poster"
              className={styles.poster}
            />
            <div className={styles.movieInfo}>
              <h1>2024/05/22(KR) · 액션, 모험, SF · 2h 29m</h1>
              <p>
                문명 붕괴 45년 후, 황폐해진 세상 속 누구에게도 알려지지 않은
                풍요가 가득한 녹색의 땅에서 자란 퓨리오사는 바이커 군단의 폭군
                디멘투스의 손에 모든 것을 잃고 만다. 가족도 행복도 모두 빼앗기고
                세상에 홀로 내던져진 퓨리오사는 반드시 고향으로 돌아가겠다는
                어머니와의 약속을 지키기 위해 인생 전부를 건 복수를
                시작하는데...
              </p>
              <button className={styles.likeButton}>
                <FaHeart /> 좋아요
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
                {post}
              </div>
            ))}
          </div>
          {posts.length > postsPerPage && (
            <div className={styles.pagination}>
              {[...Array(Math.ceil(posts.length / postsPerPage)).keys()].map(
                (number) => (
                  <button
                    key={number + 1}
                    onClick={() => paginate(number + 1)}
                    className={styles.pageButton}
                  >
                    {number + 1}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
      {isWriteModalOpen && (
        <PostWriteModal onClose={closeWriteModal} addPost={addPost} />
      )}
    </div>
  );
};

export default Modal;
