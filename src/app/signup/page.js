"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) router.push("/login");
    else alert("Signup failed");
  };

  return (
    <div className="w-full h-screen bg-white flex items-center">
      <form
        onSubmit={handleSubmit}
        className="shadow-lg py-14 px-16 space-y-10 max-w-lg mx-auto bg-blue-700 text-white rounded-lg"
      >
        <h1 className="text-center text-3xl font-bold">Signup</h1>
        <div className="font-semibold space-y-6">
          <label className="text-lg" htmlFor="name">
            Enter your name:
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full border p-2"
          />
          <label className="text-lg" htmlFor="email">
            Enter your email:
          </label>
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border p-2"
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
            className="w-full border p-2"
          />
        </div>
        <button className="w-full bg-white text-blue-900 px-6 py-2 rounded text-lg font-semibold hover:bg-blue-300 hover:cursor-pointer">
          Sign up
        </button>
        <div className="flex justify-between">
          <Link href="/" className="hover:text-black hover:cursor-pointer">
            ⬅ Back
          </Link>
          <Link href="/login" className="hover:text-gray-800">
            Already have an account. <span className="underline ">Login</span>
          </Link>
        </div>
      </form>
    </div>
  );
}
