import { API_CONFIG } from "./api";
import { toast } from "sonner";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token?: string;
  token_type?: string;
  message?: string;
  user?: {
    id: string;
    username: string;
    email?: string;
  };
}

export const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginResponse | null> => {
  // Create Basic Auth header
  const basicAuth = btoa(`${credentials.username}:${credentials.password}`);

  const response = await fetch(
    `${API_CONFIG.BASE_URL}/${API_CONFIG.ENDPOINTS.LOGIN}`,
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Invalid username or password");
    } else if (response.status === 403) {
      throw new Error("Access denied");
    } else {
      throw new Error(`Login failed: ${response.statusText}`);
    }
  }

  const data: LoginResponse = await response.json();

  // Store token if provided
  if (data.access_token) {
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("token_type", data.token_type || "Bearer");
  }

  // Store user info if provided
  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
};

export const logoutUser = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("token_type");
  localStorage.removeItem("user");
  toast.success("Logged out successfully");
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem("access_token");
};

export const getAuthHeader = (): Record<string, string> => {
  const token = getAuthToken();
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  if (token) {
    return {
      Authorization: `${tokenType} ${token}`,
    };
  }

  return {};
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Helper function to handle 401 errors and redirect to login
export const handleUnauthorized = () => {
  logoutUser();
  window.location.href = "/";
};
