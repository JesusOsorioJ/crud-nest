import axios, { AxiosResponse } from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL;

export interface Message {
  sender: string;
  content: string;
  createdAt: number;
}

export const registerUser = async (body) => {
  try {
    const response = await axios.post(`${baseURL}/auth/register`, body);
    return response;
  } catch (error) {
    console.error("Error fetching item:", error);
    return null;
  }
};


export const loginUser = async (body) => {
  try {
    const response = await axios.post(`${baseURL}/auth/login`, body);
    return response;
  } catch (error) {
    console.error("Error fetching item:", error);
    return null;
  }
};
