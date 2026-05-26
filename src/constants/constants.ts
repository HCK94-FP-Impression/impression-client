import axios from "axios";

export interface ApiErrorData {
  message: string; // or string[] depending on your API
}

export const api = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:3000',
  timeout: 2000,
  withCredentials: true
})