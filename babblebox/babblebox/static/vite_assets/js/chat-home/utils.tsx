import axios from 'axios'

//const api = import.meta.env.VITE_API_PATH as string;
const mode = import.meta.env.MODE as string;
const csrf_token = document.querySelector('[name=csrfmiddlewaretoken]').value;

console.log("Running in vite in mode: " + mode)

export var api_url = ""
export var static_url = ""
if (mode === 'production') {
  api_url = "https://babblebox-app.shivamrastogi.com/api"
  static_url = "https://babblebox-app.shivamrastogi.com/static"
} else if (mode === 'development') {
  api_url = "http://localhost:8000/api"
  static_url = "http://localhost:8000/static"
}

// Create an axios instance and csrf token on each post reaquest when this instance is used by default
export const axiosInstance = axios.create({
  baseURL: api_url,
  headers: {'X-CSRFToken': csrf_token}
});
