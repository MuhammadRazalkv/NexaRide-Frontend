export function isPastDate(dateStr: string): boolean {
  const input = new Date(dateStr);
  const today = new Date();
  input.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return input.getTime() < today.getTime();
}

export function isSameDay(dateStr1: string, dateStr2: string): boolean {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
export function getDateOnlyTimestamp(value: string): number {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}
