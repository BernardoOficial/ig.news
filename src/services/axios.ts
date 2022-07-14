import axios from "axios";

export const axi = axios.create({
    baseURL: process.env.ENV === "DEVELOPMENT"
        ? "http://localhost:3000"
        : "https://ig-news-swart-eight.vercel.app/"
})