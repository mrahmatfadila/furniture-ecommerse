import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AdminSidebar from '@/components/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // Only 'admin' role may access this area
  if (!session || (session.role as string) !== 'admin') {
    if (session && (session.role as string) === 'owner') redirect('/owner');
    redirect('/login');
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-gray-50 w-full">
      <AdminSidebar name={session.name as string} role={session.role as string} />
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto min-w-0">
        {children}
      </main>
    </div>
  );
}
