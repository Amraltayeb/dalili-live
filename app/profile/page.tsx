"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
        setEmail(data.user.email || "");
        setName(data.user.user_metadata?.name || "");
      }
      setLoading(false);
    });
    // Fetch user role from users table
    if (user && user.id) {
      supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()
        .then(({ data, error }) => {
          if (data && data.role) setUser((u: any) => ({ ...u, role: data.role }));
        });
    }
  }, [router, user && user.id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const { error } = await supabase.auth.updateUser({
      email,
      data: { name },
    });
    if (error) setError(error.message);
    else setSuccess("Profile updated!");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleUpdate} className="w-full max-w-sm p-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>
        {user?.role && (
          <div className="mb-4 text-center">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
              {user.role === 'admin' ? 'Admin' : 'User'}
            </span>
          </div>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="input mb-4 w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="input mb-4 w-full border px-3 py-2 rounded"
        />
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        {success && <div className="text-green-600 mb-4 text-center">{success}</div>}
        <button
          type="submit"
          className="btn w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition mb-2"
        >
          Update Profile
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="btn w-full bg-gray-300 text-gray-800 py-2 rounded font-semibold hover:bg-gray-400 transition"
        >
          Log Out
        </button>
      </form>
    </div>
  );
} 