"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import FolderListing from "@/components/FolderListing";
import Header from "@/components/Header";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!session) return null;

  return (
    <div>
      <Header userName={session.user.name} />
      <FolderListing userId={session.user.id} />
    </div>
  );
}
