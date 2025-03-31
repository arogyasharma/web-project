// Get the API URL from environment variables or fallback to deployed URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://web-project-quiz.onrender.com';

// Remove any trailing slashes and spaces from the URL
const cleanUrl = API_BASE_URL.trim().replace(/\/$/, '');
export const API_URL = cleanUrl;

export const API_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Helper function to build URLs
export const buildUrl = (endpoint) => {
  const cleanEndpoint = endpoint.trim().startsWith('/') ? endpoint.trim().slice(1) : endpoint.trim();
  return `${cleanUrl}/${cleanEndpoint}`.trim();
};

// Development flag for handling SSL issues
export const isDevelopment = import.meta.env.MODE === 'development'; 