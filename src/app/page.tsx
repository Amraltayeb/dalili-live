import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Dalili Live
        </h1>
        <p className="text-xl mb-8">
          Your Real-Time Business Guide for the MENA Region
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
          <Link 
            href="/en" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            English
          </Link>
          <Link 
            href="/ar" 
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            العربية
          </Link>
          <Link 
            href="/fr" 
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            Français
          </Link>
        </div>

        <p className="text-sm text-gray-600">
          Discover businesses across Egypt, UAE, and North Africa
        </p>
      </div>
    </div>
  );
} 