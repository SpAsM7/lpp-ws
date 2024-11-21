import { redirect } from "next/navigation";

// This page will never be rendered because middleware
// will redirect to either /(auth)/login or /(dashboard)/home
export default function RootPage() {
  redirect("/(auth)/login");
}
