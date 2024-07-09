import React, { useState } from "react";
import styles from "./PostWriteModal.module.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface PostWriteModalProps {
  onClose: () => void;
  addPost: (post: {
    content: string;
    file: string | null;
    rating: number;
  }) => void;
}

const PostWriteModal: React.FC<PostWriteModalProps> = ({
  onClose,
  addPost,
}) => {
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fileName = file ? file.name : null;
    addPost({ content, file: fileName, rating });
    onClose();
  };

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  const handleHover = (rate: number) => {
    setHoverRating(rate);
  };

  const handleLeave = () => {
    setHoverRating(0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const renderStars = () => {
    const stars = [];
    const effectiveRating = hoverRating || rating;
    for (let i = 1; i <= 5; i++) {
      if (effectiveRating >= i) {
        stars.push(
          <FaStar
            key={i}
            className={`${styles.star} ${styles.starFilled}`}
            onMouseEnter={() => handleHover(i)}
            onMouseLeave={handleLeave}
            onClick={() => handleRating(i)}
          />
        );
      } else if (effectiveRating >= i - 0.5) {
        stars.push(
          <FaStarHalfAlt
            key={i}
            className={`${styles.star} ${styles.starHalf}`}
            onMouseEnter={() => handleHover(i - 0.5)}
            onMouseLeave={handleLeave}
            onClick={() => handleRating(i - 0.5)}
          />
        );
      } else {
        stars.push(
          <FaRegStar
            key={i}
            className={styles.star}
            onMouseEnter={() => handleHover(i)}
            onMouseLeave={handleLeave}
            onClick={() => handleRating(i)}
          />
        );
      }
    }
    return stars;
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.starRating}>{renderStars()}</div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용"
            className={styles.textarea}
          />
          <div className={styles.fileUpload}>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <label htmlFor="file" className={styles.fileButton}>
              사진 첨부
            </label>
            {file && <span className={styles.fileName}>{file.name}</span>}
          </div>
          <button type="submit" className={styles.button}>
            작성
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostWriteModal;
