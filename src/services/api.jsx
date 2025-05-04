import axios from 'axios';

export const baseURL = "https://localhost:8000/api/";

export default axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});
    