import axios from "axios";
import { ENV } from "../env";

const apiClient = axios.create({
  baseURL: `${ENV.golangServerUrl}/api/`,
  headers: { "Content-Type": "application/json" }
})

export { apiClient }