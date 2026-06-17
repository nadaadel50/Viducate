import { useState } from "react";
import { useProfileContext } from "./use_profile_context";
import { useDeleteAccountMutation } from "./use_delete_account_mutaion";
import { useNavigate } from "react-router-dom";
import { STORAGE_KEYS } from "../../../../core/constants";

export function useDeleteAccount() {
  const { setShowDeleteModal } = useProfileContext();
  const [isDeleting, setIsDeleting] = useState(false);

  const openModal = () => setShowDeleteModal(true);
  const closeModal = () => setShowDeleteModal(false);
  const { deleteAccount } = useDeleteAccountMutation();
  const navigate = useNavigate();

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
       deleteAccount();

      localStorage.removeItem(STORAGE_KEYS.token);

      closeModal();
      navigate("/", { replace: true });
    } finally {
      setIsDeleting(false);
    }
  };

  return { isDeleting, openModal, closeModal, handleDelete };
}
