import 'vite/modulepreload-polyfill'
import React from 'react';
import ReactDOM, {createRoot} from 'react-dom/client';
import App from './app.jsx';

console.log("0000Hello friend")

const container = document.getElementById('react-root');
const root = createRoot(container); // create a root
root.render(<App />);
