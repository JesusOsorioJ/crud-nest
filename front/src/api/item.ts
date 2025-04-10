import axios, { AxiosResponse } from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL;

export interface Message {
  sender: string;
  content: string;
  createdAt: number;
}

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

authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const getAllItem = async (
  query = ""
): Promise<AxiosResponse<Message[]> | null> => {
  try {
    const response = await authApi.get(`${baseURL}/tasks?${query}`);
    return response;
  } catch (error) {
    console.error("Error fetching item:", error);
    return null;
  }
};

export const newItem = async (body): Promise<AxiosResponse<Message> | null> => {
  try {
    const response = await authApi.post(`${baseURL}/tasks/upload`, body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
};

export const updateItem = async (
  id: number,
  body
): Promise<AxiosResponse<Message> | null> => {
  try {
    const response = await authApi.patch(`${baseURL}/tasks/${id}`, body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
};

export const deleteItem = async (
  id: number
): Promise<AxiosResponse<void> | null> => {
  try {
    const response = await authApi.delete(`${baseURL}/tasks/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting item:", error);
    return null;
  }
};
