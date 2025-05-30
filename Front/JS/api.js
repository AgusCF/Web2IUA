import axios from "axios";

const api = axios.create({
    baseURL: "https://web2iua-back.onrender.com",
    headers: {
        "Content-Type": "application/json"
    }
});

export default api;