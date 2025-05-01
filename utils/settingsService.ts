import api from "./api";
import { ChangePasswordPayload } from "./type";

export const changePassword = async (payload: ChangePasswordPayload) => {
    try {
      const response = await api.patch(`/users/${payload.userId}/change-password`, {
        currentPassword: payload.currentPassword,
        newPassword: payload.newPassword,
      });
    
      console.log(payload.userId, payload.currentPassword, payload.newPassword);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to change password.";
      throw new Error(message);
    }
  };
  