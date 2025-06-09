"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { searchBusinesses } from "../../lib/dal";

export default function BusinessesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      setLoading(true);
      searchBusinesses(query).then(data => {
        setResults(data);
        setLoading(false);
      });
    } else {
      setResults([]);
    }
  }, [query]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/businesses?q=${encodeURIComponent(query)}`);
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-50">
      <form onSubmit={handleSearch} className="w-full max-w-md flex mb-6 mt-8">
        <input
          type="text"
          placeholder="Search for businesses..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1 p-2 border rounded-l"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 rounded-r">Search</button>
      </form>
      <div className="w-full max-w-md">
        {loading ? (
          <div>Loading...</div>
        ) : results.length === 0 ? (
          <div className="text-gray-500">No businesses found.</div>
        ) : (
          <ul className="divide-y">
            {results.map((biz: any) => (
              <li key={biz.id} className="py-3">
                <div className="font-semibold">{biz.name}</div>
                <div className="text-sm text-gray-600">{biz.address}</div>
                <div className="text-sm text-gray-600">{biz.phone}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 