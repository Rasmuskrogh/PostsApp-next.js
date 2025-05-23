export function formatDate(date) {
  if (!date) return "";

  // Hantera PostgreSQL timestamp format
  const dateObj =
    typeof date === "string" ? new Date(date.replace("Z", "")) : new Date(date);

  // Kontrollera om datumet är giltigt
  if (isNaN(dateObj.getTime())) {
    console.error("Invalid date:", date);
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(dateObj);
}
