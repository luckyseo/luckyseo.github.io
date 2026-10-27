import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/AdminPage";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin · Yunseo Park",
  robots: { index: false, follow: false },
};

export default function Admin() {
  return <AdminPage />;
}
