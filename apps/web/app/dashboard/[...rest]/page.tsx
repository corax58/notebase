import { notFound } from "next/navigation";

// Dashboard URLs that match no page would otherwise get the site-wide 404 and
// lose the sidebar; this hands them to the dashboard's own not-found page
export default function DashboardCatchAll() {
  notFound();
}
