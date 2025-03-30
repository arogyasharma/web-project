// Remove any trailing slashes and spaces from the URL
const cleanUrl = 'https://verbally-measured-basilisk.ngrok-free.app'.trim().replace(/\/$/, '');
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
export const isDevelopment = process.env.NODE_ENV === 'development'; 