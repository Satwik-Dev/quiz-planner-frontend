// frontend/src/config/index.js
const config = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  ENV: process.env.NODE_ENV || 'development'
};

// Log configuration in development
if (config.ENV === 'development') {
  console.log('Frontend Config:', config);
}

export default config;