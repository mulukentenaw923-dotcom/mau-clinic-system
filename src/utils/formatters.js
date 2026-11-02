export function formatDate(value, locale = 'en') {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date);
}
