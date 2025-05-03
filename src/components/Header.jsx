import LogoutButton from "./LogoutButton";
export default function Header({ userName }) {
  return (
    <header className="bg-gray-700 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Welcome, {userName}</h1>
      <LogoutButton />
    </header>
  );
}
