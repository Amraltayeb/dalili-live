import { redirect } from 'next/navigation';

export default function AdminDashboard() {
  redirect('/admin/businesses');
  return null;
} 