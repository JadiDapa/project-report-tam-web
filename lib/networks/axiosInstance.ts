import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
});

axiosInstance.interceptors.request.use((request) => {
  console.log("Starting Request", request);
  return request;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("Axios Error", error.message);
    if (error.response) {
      console.log("Server Response", error.response.data);
    }
    return Promise.reject(error);
  },
);
export default axiosInstance;
