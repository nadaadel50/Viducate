import { useState } from "react";
import { useProfileContext } from "./use_profile_context";
import { useDeleteAccountMutation } from "./use_delete_account_mutaion";
import { useNavigate } from "react-router-dom";
import { STORAGE_KEYS } from "../../../../core/constants";
import { AppRoutes } from "../../../../app/routers/appRoutes";
import { AppRoutesNames } from "../../../../app/routers/routes";
import { useAuth } from "../../../../core/hooks/useAuth";

export function useDeleteAccount() {
  const { setShowDeleteModal } = useProfileContext();
  const [isDeleting, setIsDeleting] = useState(false);
 

  const openModal = () => setShowDeleteModal(true);
  const closeModal = () => setShowDeleteModal(false);
  const { deleteAccount } = useDeleteAccountMutation();


  const handleDelete = async () => {
    setIsDeleting(true);

    try {
       
      closeModal();
      deleteAccount();
 
     
    } finally {
      setIsDeleting(false);
    
    }
  };

  return { isDeleting, openModal, closeModal, handleDelete };
}
