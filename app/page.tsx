import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { LandingPage } from "@/components/landing/LandingPage";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // Redirect authenticated users to dashboard
  if (session) {
    redirect("/dashboard");
  }

  return <LandingPage />;
}