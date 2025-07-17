import { useMutation } from "@tanstack/react-query";
import { googleLogin } from "../api/authService";
import Cookies from "js-cookie";

export const useGoogleLoginMutation = (onLoginSuccess) =>
  useMutation({
    mutationFn: googleLogin,
    onSuccess: (data) => {
      Cookies.set("token", data.token, {
        expires: 1,
        secure: true,
        sameSite: "strict",
      });
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    },
  });
