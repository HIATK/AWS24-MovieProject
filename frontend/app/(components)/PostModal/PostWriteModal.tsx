import React, { useState } from "react";
import styles from "./PostWriteModal.module.css";

interface PostWriteModalProps {
  onClose: () => void;
  addPost: (post: string) => void;
}

const PostWriteModal: React.FC<PostWriteModalProps> = ({
  onClose,
  addPost,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPost(`${title}: ${content}`);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
        <h2>게시글 작성</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            제목
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            내용
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={styles.textarea}
            />
          </label>
          <button type="submit" className={styles.button}>
            작성
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostWriteModal;
