import { login } from "@/service/authService";
import type { LoginRequest, UserInfo } from "@/types/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
    token: string | null;
    userInfo: UserInfo | null;
    isAuthenticated: boolean;
    loading: boolean;
    error : string | null;

    login:(request : LoginRequest) => Promise<void>;
    logout:() => void;
    clearError:() => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set)=>({
            token: null,
            userInfo: null,
            isAuthenticated: false,
            loading: false,
            error: null,

            login: async (request: LoginRequest) => {
                set({ loading: true, error: null });

                try {
                    const response = await login(request); 
                    localStorage.setItem("token", response.token);

                    set({
                        token: response.token,
                        userInfo: response.userInfo,
                        isAuthenticated: true,
                        loading: false,
                        error: null,
                    });
                } catch (error: any) {
                    const message = error.response?.data?.message || "Login failed. Please check your credentials.";
                    set({ loading: false, error: message });
                    throw new Error(message);
                }
            },

            logout: () => {
                localStorage.removeItem("token");
                set({
                    token: null,
                    userInfo: null,
                    isAuthenticated: false,
                    loading: false,
                    error: null,
                });
            },
            clearError: () => {
                set({ error: null });
            },
        }),
        {
            name: "auth-storage",
        }
    )
)