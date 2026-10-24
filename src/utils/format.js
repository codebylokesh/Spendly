import { TODAY, toISODate } from "../data/mockData";


export const formatINR = (n) =>
  "₹" + Math.round(n).toLocaleString("en-IN");

export const dateLabel = (isoDate) => {
  const d = new Date(isoDate + "T00:00:00");
  const t = new Date(toISODate(TODAY) + "T00:00:00");
  const diffDays = Math.round((t - d) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

export const monthKey = (isoDate) => isoDate.slice(0, 7);
export const isThisMonth = (isoDate) => monthKey(isoDate) === monthKey(toISODate(TODAY));
export const isToday = (isoDate) => isoDate === toISODate(TODAY);

