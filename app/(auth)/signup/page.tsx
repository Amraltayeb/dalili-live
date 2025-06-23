"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { createClient } from "@supabase/supabase-js";

// Use the service role client for inserting into the users table
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const supabase_client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        setLoading(true);

        // 1. Sign up the user in Supabase Auth
        const { data: authData, error: authError } = await supabase_client.auth.signUp({
            email,
            password,
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        if (authData.user) {
            // 2. Insert a corresponding record into the public.users table
            const { error: dbError } = await supabase
                .from('users')
                .insert({
                    id: authData.user.id,
                    email: authData.user.email,
                    role: 'user' // Default role
                });
            
            if (dbError) {
                // This is a critical error, but the user is already signed up.
                // You might want to handle this case, e.g., by notifying admins.
                console.error("Failed to create user record in DB:", dbError);
                setError("Sign up succeeded, but failed to create profile. Please contact support.");
            } else {
                setSuccess(true);
            }
        }
        
        setLoading(false);
    };
    
    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
                <h2 className="text-2xl font-bold mb-4">Sign Up Successful!</h2>
                <p className="mb-6">Please check your email to confirm your account.</p>
                <Link href="/login" className="btn bg-blue-600 text-white hover:bg-blue-700">
                    Go to Login
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSignUp} className="w-full max-w-sm p-8 bg-white rounded shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Create your DALILI Account</h2>
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
                placeholder="Password (at least 6 characters)"
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
                {loading ? "Creating Account..." : "Sign Up"}
            </button>
            <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Log in</Link>
            </p>
        </form>
    );
} 