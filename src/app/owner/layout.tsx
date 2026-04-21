import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import OwnerSidebar from '@/components/OwnerSidebar';

export default async function OwnerLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session || (session.role as string) !== 'owner') {
    redirect('/login');
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-gray-50 w-full">
      <OwnerSidebar name={session.name as string} role={session.role as string} />
      <main className="flex-1 p-8 overflow-y-auto min-w-0">
        {children}
      </main>
    </div>
  );
}
