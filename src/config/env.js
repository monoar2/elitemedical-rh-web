// Centralized environment-driven configuration for API and app settings
// Usage: import { API_BASE_URL, WS_URL, BASE_PATH } from '@/config/env';

const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/rh';
const basePath = import.meta.env.VITE_BASE_PATH || '/';

// WebSocket (SockJS) endpoint derived from API base by default
// You can override with VITE_WS_URL when needed
const wsUrl = import.meta.env.VITE_WS_URL || `${apiBase.replace(/\/$/, '')}/ws`;

export const API_BASE_URL = apiBase.replace(/\/$/, '');
export const BASE_PATH = basePath;
export const WS_URL = wsUrl;
