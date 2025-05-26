export default function EnglishHomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Dalili Live
        </h1>
        <p className="text-xl mb-8">
          Your Real-Time Business Guide for the MENA Region
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2">Find Businesses</h2>
            <p>Discover the best businesses across the MENA region</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2">Read Reviews</h2>
            <p>See what others are saying about local businesses</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2">Write Reviews</h2>
            <p>Share your experiences with the community</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2">Business Owners</h2>
            <p>Claim and manage your business listing</p>
          </div>
        </div>

        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Get Started
        </button>
      </div>
    </div>
  );
} 