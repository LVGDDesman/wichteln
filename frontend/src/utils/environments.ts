// Dev (`npm run dev`): VITE_BACKEND_BASE_URL from .env.development points to the local backend.
// Production build: unset, so requests go same-origin to /api (routed by the nginx proxy).
const backendHost = import.meta.env.VITE_BACKEND_BASE_URL

export const BASE_URL = backendHost ? `http://${backendHost}/api` : "/api"
