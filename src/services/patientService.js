import { apiRequest } from './api.js';

export function getPatients(options = {}) {
  return apiRequest('patients', options);
}
