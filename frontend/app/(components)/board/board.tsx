import React from "react";
import styles from "./Board.module.css";

interface BoardProps {
  post: {
    title: string;
    content: string;
    file: string | null;
    rating: number;
  };
  onClose: () => void;
}

const Board: React.FC<BoardProps> = ({ post, onClose }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
        <div className={styles.postContent}>
          <strong>평점:</strong> {post.rating} / 5s
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          {post.file && (
            <div>
              <strong>첨부 파일:</strong> {post.file}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Board;
