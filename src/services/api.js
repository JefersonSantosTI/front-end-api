import axios from "axios"

export const api = axios.create({
  baseURL: "https://Api-Backend-treino-fit.onrender.com"
})