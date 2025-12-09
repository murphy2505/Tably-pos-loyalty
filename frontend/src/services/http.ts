import axios, { type AxiosRequestHeaders } from "axios";

const api = axios.create({
  baseURL: "/",
});

api.interceptors.request.use((config) => {
  if (!config.headers) config.headers = {} as AxiosRequestHeaders;
  config.headers["x-tenant-id"] = "demo-tenant";
  return config;
});

export default api;
