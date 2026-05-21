import { useState } from 'react';

export function useDeleteAccount() {
  const [showModal, setShowModal]   = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const openModal  = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    // TODO: استبدل بـ real API call
    setTimeout(() => {
      setIsDeleting(false);
      closeModal();
      alert('Account deleted successfully.');
    }, 1500);
  };

  return { showModal, isDeleting, openModal, closeModal, handleDelete };
}
