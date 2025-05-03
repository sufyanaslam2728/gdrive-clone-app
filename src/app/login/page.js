"use client";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res.ok) router.push("/dashboard");
    else toast.error("Login failed. Invalid email and password.");
  };

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="text-center mt-20 text-lg">Checking session...</div>;
  }

  if (status === "authenticated") return null;

  return (
    <div className="w-full h-screen bg-white flex items-center">
      <form
        onSubmit={handleSubmit}
        className="shadow-lg py-14 px-16 space-y-10 max-w-lg mx-auto bg-blue-700 text-white rounded-lg"
      >
        <h1 className="text-center text-3xl font-bold">Login</h1>
        <div className="font-semibold space-y-6">
          <label className="text-lg" htmlFor="email">
            Enter your email:
          </label>
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border p-2 shadow-2xl"
          />
          <label className="text-lg" htmlFor="password">
            Enter your passsword:
          </label>
          <input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="w-full border p-2 shadow-2xl"
          />
        </div>
        <button className="w-full bg-white text-blue-900 px-6 py-2 rounded text-lg font-semibold hover:bg-blue-300 hover:cursor-pointer shadow-2xl">
          Log in
        </button>
        <div className="flex justify-between">
          <Link href="/" className="hover:text-black">
            ⬅ Back
          </Link>
          <Link href="/signup" className="hover:text-gray-800">
            Create a new account. <span className="underline">SignUp</span>
          </Link>
        </div>
      </form>
    </div>
  );
}
