import axios from "axios";

const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const menuApi = axios.create({
  baseURL: import.meta.env.VITE_MENU_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const orderApi = axios.create({
  baseURL: import.meta.env.VITE_ORDER_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const addAuthInterceptor = (api: typeof authApi) => {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  return api;
};

export const authClient = addAuthInterceptor(authApi);
export const menuClient = addAuthInterceptor(menuApi);
export const orderClient = addAuthInterceptor(orderApi);