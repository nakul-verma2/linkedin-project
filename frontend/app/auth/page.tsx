/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = "http://localhost:5000"; // Edit if your API runs elsewhere

export default function AuthPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", name: "", bio: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    // Validation (same as your prototype)
    if (!form.email || !form.password)
      return setMessage({ type: "error", text: "Email and password are required" });
    if (!isLoginMode && !form.name)
      return setMessage({ type: "error", text: "Name is required for registration" });

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${isLoginMode ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isLoginMode
          ? { email: form.email, password: form.password }
          : { email: form.email, password: form.password, name: form.name, bio: form.bio }),
      });
      const data = await res.json();

      if (data.success) {
        // Save to localStorage, redirect to home/feed
        const user = isLoginMode ? data.user : { uid: data.uid, ...form };
        localStorage.setItem("user", JSON.stringify(user));
        setMessage({ type: "success", text: isLoginMode ? "Login successful!" : "Registration successful!" });
        setTimeout(() => router.push("/"), 800);
      } else {
        setMessage({ type: "error", text: data.error || "Auth failed" });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: "Network error" });
    }
    setLoading(false);
  }

  function toggleMode() {
    setIsLoginMode(v => !v);
    setForm({ email: "", password: "", name: "", bio: "" });
    setMessage(null);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
  <form
    onSubmit={handleSubmit}
    className="glass-card w-full max-w-md rounded-2xl p-8 flex flex-col space-y-6 border-2 border-transparent shadow-xl"
    style={{
      borderImage: "linear-gradient(90deg, #60a5fa, #a78bfa, #fb7185) 1",
      // You can play with these gradient colors!
    }}
  >
    <h2 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(168,85,247,0.7)]">
      {isLoginMode ? "Login" : "Register"}
    </h2>
    {!isLoginMode && (
      <>
        <input
          name="name"
          placeholder="Full Name"
          className="glass-input py-2 px-4 rounded-lg text-white placeholder-white"
          value={form.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="bio"
          placeholder="Bio (optional)"
          className="glass-input py-2 px-4 rounded-lg text-white placeholder-white"
          value={form.bio}
          onChange={handleChange}
          rows={2}
        />
      </>
    )}
    <input
      name="email"
      type="email"
      placeholder="Email"
      className="glass-input py-2 px-4 rounded-lg text-white placeholder-white"
      value={form.email}
      onChange={handleChange}
      required
    />
    <input
      name="password"
      type="password"
      placeholder="Password"
      className="glass-input py-2 px-4 rounded-lg text-white placeholder-white"
      value={form.password}
      onChange={handleChange}
      required
    />
    <button
      type="submit"
      className="w-full rounded-lg py-2 bg-blue-600 hover:bg-purple-600 transition-colors text-white font-semibold shadow-md shadow-purple-500/30"
      disabled={loading}
    >
      {loading ? "Please wait..." : isLoginMode ? "Login" : "Register"}
    </button>
    {message && (
      <div
        className={
          "rounded-md px-4 py-2 text-center " +
          (message.type === "success"
            ? "bg-green-700/30 text-green-200"
            : "bg-red-700/30 text-red-200")
        }
      >
        {message.text}
      </div>
    )}
    <div className="text-center pt-2 text-white">
      <span>
        {isLoginMode ? "Don't have an account?" : "Already have an account?"}
      </span>
      <button
        type="button"
        className="ml-2 text-blue-400 hover:underline"
        onClick={toggleMode}
      >
        {isLoginMode ? "Register" : "Login"}
      </button>
    </div>
  </form>
</div>
  );
}
