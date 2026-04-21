"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.user.role === 'admin' || data.user.role === 'owner') {
         // redirect to admin dashboard
         window.location.href = '/admin';
      } else {
         window.location.href = '/';
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-20 mt-10 w-full">
       <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-md w-full">
          <div className="text-center mb-8">
             <Link href="/" className="text-3xl font-bold tracking-tight text-[#133A42] flex items-center justify-center gap-2 mb-2">
               <span className="text-4xl leading-none">✺</span> Furniture
             </Link>
             <p className="text-gray-500 text-sm">Sign in to your account</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
             {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium border border-red-100">{error}</div>}
             
             <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00A19D] focus:border-transparent transition-all outline-none text-gray-800"
                  placeholder="admin@furniture.com"
                />
             </div>
             
             <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00A19D] focus:border-transparent transition-all outline-none text-gray-800"
                  placeholder="••••••••"
                />
             </div>
             
             <button disabled={loading} type="submit" className="w-full bg-[#133A42] text-white font-semibold rounded-xl py-3 hover:bg-emerald-950 transition-colors disabled:opacity-50">
                {loading ? 'Signing in...' : 'Sign In'}
             </button>
             
             <div className="pt-4 text-center border-t border-gray-100">
               <p className="text-sm text-gray-500 mb-2">Default test accounts:</p>
               <p className="text-xs text-gray-400">owner@furniture.com / owner123 (Owner)</p>
               <p className="text-xs text-gray-400">admin@furniture.com / admin123 (Admin)</p>
               <p className="text-xs text-gray-400">user@furniture.com / user123 (User)</p>
             </div>
          </form>
       </div>
    </div>
  );
}
