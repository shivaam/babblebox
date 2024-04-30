import axios from 'axios'

//const api = import.meta.env.VITE_API_PATH as string;
const mode = import.meta.env.MODE as string;
const csrf_token = document.querySelector('[name=csrfmiddlewaretoken]').value;

console.log("Running in vite in mode: " + mode)

var api = ""
if (mode === 'production') {
  api = "https://babblebox.herokuapp.com/api"
} else if (mode === 'development') {
  api = "http://localhost:8000/api"
}

// Create an axios instance and csrf token on each post reaquest when this instance is used by default
export const axiosInstance = axios.create({
  baseURL: api,
  headers: {'X-CSRFToken': csrf_token}
});
