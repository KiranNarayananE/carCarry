import axiosInstance from "./axios";

export const GoogleAuth = async (id) => {
  const response = await axiosInstance.post("/google", { id });
  const data = response;

  return data;
};