// src/utils/resourceUtils.js
import { BASE_URL } from "../api/axios.js";

export const resolveResourceUrl = (url) => {
  if (!url) return '';
  // If it's already an absolute URL (HTTP/HTTPS), return as-is (e.g., Drive links)
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  // Otherwise, prepend the backend base URL (e.g., Uploaded files)
  return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};