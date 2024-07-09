'use client'

// app/@modal/movies/[id]/page.tsx
import { useParams } from 'next/navigation';
import Modal from '@/(components)/Modal';

export default function MovieModal() {
  const params = useParams();
  const { id } = params;

  const closeModal = () => {
    window.history.back();
  };

  return (
    <Modal onClose={closeModal}>
      <h2>Movie ID:adsadsf {id}</h2>
      <p>Movie details for {id}.</p>
    </Modal>
  );
}
