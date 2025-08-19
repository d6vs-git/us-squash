import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CLUBLOCKER_API,
  withCredentials: true, 
});

export default axiosInstance;