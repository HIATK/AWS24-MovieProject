'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextProps {
  isModalOpen: boolean;
  movieId: string | null;
  openModal: (id: string) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movieId, setMovieId] = useState<string | null>(null);

  const openModal = (id: string) => {
    setMovieId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setMovieId(null);
    setIsModalOpen(false);
  };

  return (
    <ModalContext.Provider value={{ isModalOpen, movieId, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
