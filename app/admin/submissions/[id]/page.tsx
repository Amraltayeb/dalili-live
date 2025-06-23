"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getSubmissionById } from '@/lib/dal';
import { checkUserRole } from '@/lib/auth';

// Define a more detailed type for a single submission
interface SubmissionDetails {
    id: string;
    business_name: string;
    business_name_ar?: string;
    description: string;
    description_ar?: string;
    phone: string;
    address: string;
    area: string;
    governorate: string;
    photos?: string[];
    // Add any other fields you need to display
}

export default function SubmissionDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [submission, setSubmission] = useState<SubmissionDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const fetchSubmission = async () => {
            const { isAdmin } = await checkUserRole();
            if (!isAdmin) {
                router.push('/');
                return;
            }
            if (id) {
                try {
                    const data = await getSubmissionById(id);
                    setSubmission(data);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchSubmission();
    }, [id, router]);

    const handleApprove = async () => {
        setIsProcessing(true);
        setError(null);
        try {
            const response = await fetch(`/api/admin/submissions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'approve' }),
            });
            if (!response.ok) throw new Error('Approval failed.');
            alert('Submission approved!');
            router.push('/admin/submissions');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        const reason = prompt('Please provide a reason for rejection (optional):');
        setIsProcessing(true);
        setError(null);
        try {
            const response = await fetch(`/api/admin/submissions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'reject', reason }),
            });
            if (!response.ok) throw new Error('Rejection failed.');
            alert('Submission rejected.');
            router.push('/admin/submissions');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) return <div className="text-center p-10">Loading...</div>;
    if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;
    if (!submission) return <div className="text-center p-10">Submission not found.</div>;

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-4">{submission.business_name}</h1>
            <h2 className="text-xl text-gray-600 mb-6">{submission.business_name_ar}</h2>
            
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <p><strong>Description:</strong> {submission.description}</p>
                <p><strong>Description (AR):</strong> {submission.description_ar}</p>
                <p><strong>Phone:</strong> {submission.phone}</p>
                <p><strong>Address:</strong> {submission.address}</p>
                <p><strong>Area:</strong> {submission.area}, {submission.governorate}</p>
                
                {submission.photos && submission.photos.length > 0 && (
                    <div>
                        <strong>Photos:</strong>
                        <div className="flex space-x-4 mt-2">
                            {submission.photos.map(photo => (
                                <img key={photo} src={photo} alt="Business Photo" className="w-32 h-32 object-cover rounded"/>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            <div className="mt-8 flex space-x-4">
                <button 
                    onClick={handleApprove} 
                    disabled={isProcessing}
                    className="btn bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400"
                >
                    {isProcessing ? 'Approving...' : 'Approve'}
                </button>
                <button 
                    onClick={handleReject} 
                    disabled={isProcessing}
                    className="btn bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400"
                >
                    {isProcessing ? 'Rejecting...' : 'Reject'}
                </button>
            </div>
        </div>
    );
} 