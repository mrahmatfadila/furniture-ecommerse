"use client";
import { useEffect, useState } from 'react';
import { Edit2, X } from 'lucide-react';

type User = {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'owner';
  created_at: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actingParams, setActingParams] = useState<{ id: number; loading: boolean } | null>(null);

  // Edit modal state
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', role: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setUsers(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const changeRole = async (userId: number, newRole: string) => {
    setActingParams({ id: userId, loading: true });
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newRole })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      
      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
      alert('Role updated successfully.');
    } catch (err: any) {
       alert(err.message);
    } finally {
       setActingParams(null);
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditFormData({ name: user.name, email: user.email, role: user.role });
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setEditFormData({ name: '', email: '', role: '' });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    
    setSaving(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: editingUser.id,
          name: editFormData.name,
          email: editFormData.email,
          newRole: editFormData.role
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      // Update local state
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, name: editFormData.name, email: editFormData.email, role: editFormData.role as any } : u));
      alert('User updated successfully.');
      closeEditModal();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-500 font-semibold animate-pulse">Loading users...</div>;
  if (error) return <div className="p-8 text-red-500 font-semibold">Error: {error}</div>;

  return (
    <div className="w-full relative">
       {/* Edit Modal */}
       {editingUser && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl relative animate-in zoom-in-95 duration-200">
               <button onClick={closeEditModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                 <X size={24} />
               </button>
               <h2 className="text-2xl font-bold text-[#133A42] mb-6">Edit User #{editingUser.id}</h2>
               
               <form onSubmit={handleEditSubmit} className="space-y-4">
                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                   <input
                     type="text"
                     required
                     value={editFormData.name}
                     onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                     className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00A19D]"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                   <input
                     type="email"
                     required
                     value={editFormData.email}
                     onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                     className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00A19D]"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                   <select
                     value={editFormData.role}
                     onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                     className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00A19D]"
                   >
                     <option value="user">User</option>
                     <option value="admin">Admin</option>
                     <option value="owner">Owner</option>
                   </select>
                 </div>
                 
                 <div className="pt-4 flex gap-3">
                   <button type="button" onClick={closeEditModal} className="flex-1 py-2 px-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                     Cancel
                   </button>
                   <button type="submit" disabled={saving} className="flex-1 py-2 px-4 rounded-xl font-bold text-white bg-[#00A19D] hover:bg-[#008f8b] transition-colors disabled:opacity-50">
                     {saving ? 'Saving...' : 'Save Changes'}
                   </button>
                 </div>
               </form>
            </div>
         </div>
       )}

       <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#133A42]">Manage Users</h1>
          <span className="bg-emerald-50 text-[#00A19D] px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">{users.length} Users Total</span>
       </div>
       
       <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">User ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Email</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
               {users.map(user => (
                 <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5 text-sm font-semibold text-gray-500">#{user.id}</td>
                    <td className="px-6 py-5 text-sm font-bold text-[#133A42]">{user.name}</td>
                    <td className="px-6 py-5 text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-5">
                       <select 
                         disabled={actingParams?.id === user.id && actingParams.loading}
                         value={user.role} 
                         onChange={(e) => changeRole(user.id, e.target.value)}
                         className="bg-gray-50 border border-gray-200 text-[#133A42] text-sm rounded-lg focus:ring-[#00A19D] focus:border-[#00A19D] block w-full p-2.5 font-semibold outline-none disabled:opacity-50"
                       >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="owner">Owner</option>
                       </select>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <button 
                         onClick={() => openEditModal(user)}
                         className="p-2 text-[#00A19D] bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                         title="Edit User"
                       >
                         <Edit2 size={18} />
                       </button>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
       </div>
    </div>
  );
}
