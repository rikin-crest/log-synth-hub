import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  loginUser,
  logoutUser,
  LoginCredentials,
  LoginResponse,
} from "@/api/auth";

/**
 * Hook for user login
 */
export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation<LoginResponse | null, Error, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials) => {
      return await loginUser(credentials);
    },
    onSuccess: (data) => {
      if (data?.access_token) {
        toast.success("Login successful!");
        navigate("/dashboard");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Login failed");
    },
  });
};

/**
 * Hook for user logout
 */
export const useLogout = () => {
  const navigate = useNavigate();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      logoutUser();
    },
    onSuccess: () => {
      navigate("/");
    },
  });
};
