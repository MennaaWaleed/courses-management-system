// src/utils/resourceUtils.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const resolveResourceUrl = (url) => {
  if (!url) return '';
  // If it's already an absolute URL (HTTP/HTTPS), return as-is (e.g., Drive links)
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  // Otherwise, prepend the backend base URL (e.g., Uploaded files)
  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};