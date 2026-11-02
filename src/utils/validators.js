export function isRequired(value) {
  return String(value ?? '').trim().length > 0;
}

export function isValidPhone(value) {
  return /^\+?[\d\s()-]{7,20}$/.test(String(value ?? '').trim());
}
