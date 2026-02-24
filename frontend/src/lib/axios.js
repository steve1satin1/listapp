import axios from "axios";

 const api = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? 
    'http://localhost:5000/api/notes' :
    '/api',
    withCredentials: true
});

export const authapi = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? 
    'http://localhost:5000/api/' :
    '/api',
    withCredentials: true
});


export default api;
