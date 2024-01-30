import axios from 'axios'
import https from 'https'

export const axiosInstance = axios.create({
  baseURL: 'https://localhost/api/'
});
