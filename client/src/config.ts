const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
} as const;

export default config; 