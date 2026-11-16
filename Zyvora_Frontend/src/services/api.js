
import axios from "axios";

const api = axios.create({
    // Use Vite proxy instead of directly calling port 9090
    baseURL: "",

    // Allow browser cookies to be included
    withCredentials: true,

    headers: {
        "Content-Type": "application/json"
    }
});

export default api;
