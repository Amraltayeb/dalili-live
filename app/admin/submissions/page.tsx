"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getPendingSubmissions } from '@/lib/dal';
import { checkUserRole } from '@/lib/auth'; // We will create this helper

// Define the type for a submission, matching your table structure
interface Submission {
  id: string;
  business_name: string;
  business_name_ar?: string;
  area: string;
  created_at: string;
}

export default function AdminSubmissionsPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyAdmin = async () => {
      const { isAdmin, error: roleError } = await checkUserRole();
      if (roleError || !isAdmin) {
        router.push('/'); // Redirect non-admins to homepage
        return;
      }

      try {
        const data = await getPendingSubmissions();
        setSubmissions(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    verifyAdmin();
  }, [router]);

  if (loading) {
    return <div className="text-center p-10">Loading submissions...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pending Business Submissions</h1>
      {submissions.length === 0 ? (
        <p className="text-gray-500">No pending submissions to review.</p>
      ) : (
        <ul className="space-y-4">
          {submissions.map((sub) => (
            <li key={sub.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <Link href={`/admin/submissions/${sub.id}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-blue-600">{sub.business_name} ({sub.business_name_ar})</p>
                    <p className="text-sm text-gray-500">{sub.area}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </p>
                    <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs font-medium rounded-full">
                      Pending
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 