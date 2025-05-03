"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50 text-center">
      <h1 className="text-4xl font-bold mb-4 text-blue-700">
        Welcome to DriveClone
      </h1>
      <p className="text-lg mb-8 text-blue-900">
        Please login or signup to continue.
      </p>
      <div className="space-x-4">
        <button
          onClick={() => router.push("/login")}
          className="bg-blue-600 hover:bg-blue-800 hover:cursor-pointer text-white px-6 py-2 rounded font-semibold"
        >
          Login
        </button>
        <button
          onClick={() => router.push("/signup")}
          className="hover:cursor-pointer bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded font-semibold"
        >
          Signup
        </button>
      </div>
    </main>
  );
}
