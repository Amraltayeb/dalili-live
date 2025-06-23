"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push("/");
    }
  };

  return (
    <form onSubmit={handleLogin} className="w-full max-w-sm p-8 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign in to DALILI</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="input mb-4 w-full border px-3 py-2 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="input mb-4 w-full border px-3 py-2 rounded"
      />
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      <button
        type="submit"
        className="btn w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
} 