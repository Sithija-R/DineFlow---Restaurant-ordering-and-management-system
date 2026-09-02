import { authClient } from "./api";
import type { LoginRequest, LoginResponse, RegisterRequest } from "../types/auth";

export const login = async (request: LoginRequest): Promise<LoginResponse> => {
  const response = await authClient.post<LoginResponse>(
    "/api/auth/login",
    request
  );

  return response.data;
};

export const register = async (request: RegisterRequest): Promise<LoginResponse> => {
  const response = await authClient.post<LoginResponse>(
    "/api/auth/register",
    request
  );

  return response.data;
}