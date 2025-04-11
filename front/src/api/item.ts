import axios, { AxiosResponse } from "axios";
import { Item } from "../pages/Tasks";

const baseURL = import.meta.env.VITE_BACKEND_URL;

export interface Message {
  sender: string;
  content: string;
  createdAt: number;
}

interface GetAllItemResponse {
    totalItems: number;
    totalPages: number;
    data: Item[];
}

// Interceptor de solicitudes para agregar el token
export const authApi = axios.create({
  baseURL,
});

authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      window.location.href = "/login";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuestas para manejar errores 401
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const getAllItem = async (
  query: string = ""
): Promise<AxiosResponse<GetAllItemResponse> | null> => {
  try {
    const response: AxiosResponse<GetAllItemResponse> = await authApi.get(`/tasks?${query}`);
    return response;
  } catch (error) {
    console.error("Error fetching item:", error);
    return null;
  }
};

// Función para crear un nuevo item
export const newItem = async (
  body: Item
): Promise<AxiosResponse<Item> | null> => {
  try {
    const response: AxiosResponse<Item> = await authApi.post(`/tasks/upload`, body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Error sending item:", error);
    return null;
  }
};

// Función para actualizar un item
export const updateItem = async (
  id: number,
  body: Item
): Promise<AxiosResponse<Item> | null> => {
  try {
    const response: AxiosResponse<Item> = await authApi.patch(`/tasks/${id}`, body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Error sending item", error);
    return null;
  }
};

// Función para eliminar un item
export const deleteItem = async (
  id: number
): Promise<AxiosResponse<void> | null> => {
  try {
    const response: AxiosResponse<void> = await authApi.delete(`/tasks/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting item", error);
    return null;
  }
};
