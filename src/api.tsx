import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api",  // your backend API URL
    withCredentials: true,                  // if you use cookies like refresh token cookie
});

export default api;
