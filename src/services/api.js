import axios from "axios"

export const api = axios.create({
  baseURL: "https://back-end-api-treinofit-1.onrender.com"
})