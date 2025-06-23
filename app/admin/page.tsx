"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push("/login");
        return;
      }
      // Fetch user role from users table
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();
      if (!userData || userData.role !== 'admin') {
        router.push("/");
        return;
      }
      setUser({ ...data.user, role: userData.role });
      setLoading(false);
    });
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg p-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h2>
        <div className="mb-4 text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Admin</span>
        </div>
        <p className="mb-6 text-center">Welcome, {user?.email}!</p>
        <ul className="list-disc pl-6">
          <li>Review and approve business submissions (coming soon)</li>
          <li>Moderate reviews (coming soon)</li>
          <li>Manage categories and areas (coming soon)</li>
        </ul>
      </div>
    </div>
  );
} 