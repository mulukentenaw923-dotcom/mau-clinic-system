import { apiRequest } from './api.js';

export function getAppointments(options = {}) {
  return apiRequest('appointments', options);
}
