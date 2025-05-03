import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import LogoutButton from "./LogoutButton";
import { redirect } from "next/navigation";
import FolderListing from "./FolderListing";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <Header userName={session.user.name} />
      <FolderListing userId={session.user.id} />
    </div>
  );
}

// Header Component
function Header({ userName }) {
  return (
    <header className="bg-gray-700 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Welcome, {userName}</h1>
      <LogoutButton />
    </header>
  );
}
