import axios from 'axios';

export const baseURL = "http://localhost:8000/";

export default axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});
    