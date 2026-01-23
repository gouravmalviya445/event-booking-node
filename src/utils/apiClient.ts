import axios from "axios";
import { ENV } from "../env";

const apiClient = axios.create({
  baseURL: `${ENV.golangServerUrl}`,
  headers: { "Content-Type": "application/json" }
})

export { apiClient }