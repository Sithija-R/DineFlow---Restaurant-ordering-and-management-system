import { authClient } from "./api";
import type { LoginRequest, LoginResponse } from "../types/auth";

export const login = async (request: LoginRequest): Promise<LoginResponse> => {
  const response = await authClient.post<LoginResponse>(
    "/api/auth/login",
    request
  );

  return response.data;
};