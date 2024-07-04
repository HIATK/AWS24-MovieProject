// components/TestPage.tsx
import React, { useState } from "react";
import Modal from "./PostModal/Post.Modal";
import styles from "./PostModal/Post.Modal.module.css";

const TestPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button onClick={openModal} className={styles.openButton}>
        Open Modal
      </button>
      {isModalOpen && <Modal onClose={closeModal} />}
    </div>
  );
};

export default TestPage;
