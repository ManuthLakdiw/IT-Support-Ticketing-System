import type { Metadata } from "next";
import { userService as usersApi } from "@/services/userService";
import AdminPanel from "./AdminPanel";

export const metadata: Metadata = { title: "Admin Panel" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const result = await usersApi.getAll();
  const users = result.ok ? result.data : [];

  return <AdminPanel initialUsers={users} />;
}
