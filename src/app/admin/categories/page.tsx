"use client";
import { useEffect, useState, useRef } from 'react';
import { Upload, ImageIcon, Check, X, Pencil } from 'lucide-react';

type Category = {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [uploading, setUploading] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    const res = await fetch('/api/admin/categories');
    const data = await res.json();
    setCategories(data.data);
    setLoading(false);
  };

  const uploadImage = async (file: File, catId: number) => {
    setUploading(catId);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      // Save image URL to DB directly
      const cat = categories.find(c => c.id === catId)!;
      await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: catId, name: cat.name, image_url: data.url }),
      });
      setCategories(prev => prev.map(c => c.id === catId ? { ...c, image_url: data.url } : c));
    } catch (e: any) { alert(e.message); }
    finally { setUploading(null); }
  };

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>, catId: number) => {
    const file = e.target.files?.[0];
    if (file) uploadImage(file, catId);
  };

  const saveName = async (cat: Category) => {
    setSaving(true);
    try {
      await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cat.id, name: editName, image_url: cat.image_url }),
      });
      setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, name: editName } : c));
      setEditId(null);
    } catch (e: any) { alert(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#133A42]">Kelola Kategori</h1>
        <p className="text-gray-400 text-sm mt-1">Upload gambar dan ubah nama setiap kategori yang tampil di halaman toko.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 text-gray-400 animate-pulse font-semibold">Memuat...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(cat => (
            <div key={cat.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              {/* Image Upload Zone */}
              <div
                className={`relative w-full h-44 cursor-pointer group ${dragOver === cat.id ? 'ring-2 ring-[#00A19D]' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(cat.id); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={e => {
                  e.preventDefault();
                  setDragOver(null);
                  const file = e.dataTransfer.files?.[0];
                  if (file) uploadImage(file, cat.id);
                }}
                onClick={() => fileRefs.current[cat.id]?.click()}
              >
                <input
                  ref={el => { fileRefs.current[cat.id] = el; }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => handleFilePick(e, cat.id)}
                />

                {uploading === cat.id ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <div className="flex flex-col items-center gap-2 text-[#00A19D]">
                      <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-semibold">Mengunggah...</span>
                    </div>
                  </div>
                ) : cat.image_url ? (
                  <>
                    <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-white text-xs font-bold flex items-center gap-2">
                        <Upload className="w-4 h-4" /> Ganti Gambar
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center gap-2 text-gray-400 group-hover:bg-gray-100 transition-colors">
                    <ImageIcon className="w-10 h-10 opacity-30" />
                    <p className="text-xs font-semibold">Klik atau seret gambar</p>
                  </div>
                )}
              </div>

              {/* Name + Slug */}
              <div className="p-4 flex flex-col gap-1">
                {editId === cat.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') saveName(cat); if (e.key === 'Escape') setEditId(null); }}
                      className="flex-1 text-sm font-bold border border-[#00A19D] rounded-lg px-2 py-1 outline-none text-[#133A42]"
                    />
                    <button onClick={() => saveName(cat)} disabled={saving} className="text-[#00A19D] hover:text-[#133A42]">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditId(null)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#133A42] text-sm">{cat.name}</p>
                      {cat.slug && <p className="text-[10px] text-gray-400 font-mono">{cat.slug}</p>}
                    </div>
                    <button
                      onClick={() => { setEditId(cat.id); setEditName(cat.name); }}
                      className="text-gray-300 hover:text-[#133A42] transition-colors p-1"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-5 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-800">
        <strong>💡 Tips:</strong> Klik pada area gambar atau seret file gambar langsung ke kotak kategori untuk mengganti foto. Perubahan langsung tersimpan otomatis.
      </div>
    </div>
  );
}
