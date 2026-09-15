import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3005/api', timeout: 10000 });
export const shows = () => api.get('/shows').then((r) => r.data.items);
export const show = (id) => api.get(`/shows/${id}`).then((r) => r.data);
export const bid = (lotId, d) => api.post(`/lots/${lotId}/bid`, d).then((r) => r.data);
export const closeLot = (lotId) => api.post(`/lots/${lotId}/close`).then((r) => r.data);
