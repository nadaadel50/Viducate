from sqlalchemy.orm import Session
from app.repositories.user_repository import UserRepository
from app.core.security import hash_password
from app.schemas.profile_schema import UpdateProfileRequest
from fastapi import HTTPException, status
from app.core.security import verify_password

class UpdateProfileService:


    def __init__(self, db: Session):
        self.user_repo = UserRepository(db)

    def update_language(self, user_id: int, language: str):
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )
        return self.user_repo.update_language(user, language)
    


    def update_profile(self, user_id: int, request: UpdateProfileRequest):
     user = self.user_repo.get_by_id(user_id)
     if not user:
          raise HTTPException(status_code=404, detail="User not found")

     # Update name
     if request.first_name:
          user.first_name = request.first_name
     if request.last_name:
          user.last_name = request.last_name

     # Password change
     if request.new_password:
          if not verify_password(request.current_password, user.password):
               raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Current password is incorrect"
               )
          user.password = hash_password(request.new_password)

     return self.user_repo.update(user)
    

    def delete_account(self, user_id: int):
     deleted = self.user_repo.delete_user(user_id)
     if not deleted:
          raise HTTPException(status_code=404, detail="User not found")
     return {"message": "Account deleted successfully"}