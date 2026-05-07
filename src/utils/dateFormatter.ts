const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(date: string | Date) {
  const value = typeof date === "string" ? new Date(date) : date;
  return dateFormatter.format(value);
}
