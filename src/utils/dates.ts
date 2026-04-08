export function pad2(value: number) {
  return value < 10 ? `0${value}` : `${value}`;
}

export function toISODate(date: Date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function fromISODate(isoDate: string) {
  const [y, m, d] = isoDate.split('-').map((x) => Number(x));
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function formatMonthYear(date: Date) {
  const month = date.toLocaleString(undefined, { month: 'long' });
  const year = date.getFullYear();
  return `${month}, ${year}`;
}

export function formatShortMonthYear(date: Date) {
  return date.toLocaleString(undefined, { month: 'short', year: 'numeric' });
}

export function formatTime(date: Date) {
  const hours = date.getHours();
  const minutes = pad2(date.getMinutes());
  const suffix = hours >= 12 ? 'pm' : 'am';
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${h12}:${minutes}${suffix}`;
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function addMonths(date: Date, delta: number) {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}
