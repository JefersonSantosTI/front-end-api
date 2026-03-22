import axios from "axios"

export const api = axios.create({
  baseURL: "https://api-backend-treino-fit.onrender.com"
})