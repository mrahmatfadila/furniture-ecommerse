"use client";
import { useEffect, useState, useRef } from 'react';
import { PlusCircle, Pencil, Trash2, X, Check, Eye, Upload, ImageIcon } from 'lucide-react';
import { formatRupiah } from '@/lib/currency';

type Product = {
  id: number;
  name: string;
  price: string;
  sale_price: string | null;
  image_url: string;
  category: string;
  status: string;
  description: string | null;
};

const EMPTY_FORM: Omit<Product, 'id'> = {
  name: '',
  price: '',
  sale_price: '',
  image_url: '',
  category: 'Furniture',
  status: 'in_stock',
  description: '',
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  in_stock: { label: 'In Stock',  color: 'bg-green-50 text-green-700 border-green-200' },
  sold_out: { label: 'Sold Out',  color: 'bg-red-50 text-red-700 border-red-200' },
  new_in:   { label: 'New In',    color: 'bg-blue-50 text-blue-700 border-blue-200' },
  on_sale:  { label: 'On Sale',   color: 'bg-amber-50 text-amber-700 border-amber-200' },
};

export default function AdminProductsPage() {
  const [products, setProducts]     = useState<Product[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [editId, setEditId]         = useState<number | null>(null);
  const [form, setForm]             = useState<Omit<Product, 'id'>>(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);
  const [preview, setPreview]       = useState<Product | null>(null);
  const [uploading, setUploading]   = useState(false);
  const [dragOver, setDragOver]     = useState(false);
  const fileRef                     = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/admin/products');
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setProducts(data.data);
    } catch (err: any) { alert(err.message); }
    finally { setLoading(false); }
  };

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setShowModal(true); };
  const openEdit = (p: Product) => {
    setForm({ name: p.name, price: p.price, sale_price: p.sale_price ?? '', image_url: p.image_url, category: p.category, status: p.status, description: p.description ?? '' });
    setEditId(p.id);
    setShowModal(true);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res  = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setForm(f => ({ ...f, image_url: data.url }));
    } catch (err: any) { alert(err.message); }
    finally { setUploading(false); }
  };

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image_url) { alert('Please upload a product image first.'); return; }
    setSaving(true);
    try {
      const url  = editId ? `/api/admin/products/${editId}` : '/api/admin/products';
      const meth = editId ? 'PUT' : 'POST';
      const res  = await fetch(url, { method: meth, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setShowModal(false);
      fetchProducts();
    } catch (err: any) { alert(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    try {
      const res  = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setProducts(p => p.filter(x => x.id !== id));
    } catch (err: any) { alert(err.message); }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#133A42]">Manage Products</h1>
          <p className="text-gray-400 text-sm mt-1">Products shown here appear as <span className="font-semibold text-[#00A19D]">Trending Picks</span> on the Home page.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#133A42] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#00A19D] transition-colors">
          <PlusCircle className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-48 text-gray-400 font-semibold animate-pulse">Loading...</div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3 bg-white rounded-3xl border border-dashed border-gray-200">
          <PlusCircle className="w-10 h-10 opacity-30" />
          <p className="font-semibold">No products yet. Add your first one!</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-widest">
                <th className="px-5 py-4 text-left w-14">#</th>
                <th className="px-5 py-4 text-left">Product</th>
                <th className="px-5 py-4 text-left">Category</th>
                <th className="px-5 py-4 text-left">Price</th>
                <th className="px-5 py-4 text-left">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-4 text-gray-400 font-medium">#{p.id}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image_url} alt={p.name} className="w-12 h-12 rounded-xl object-cover bg-gray-100 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-[#133A42]">{p.name}</p>
                        {p.description && <p className="text-xs text-gray-400 mt-0.5 max-w-[200px] truncate">{p.description}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{p.category}</td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-[#133A42]">{formatRupiah(p.price)}</span>
                    {p.sale_price && <span className="text-gray-400 line-through text-xs">{formatRupiah(p.sale_price)}</span>}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-3 py-1 rounded-full border text-xs font-bold ${STATUS_LABELS[p.status]?.color ?? 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                      {STATUS_LABELS[p.status]?.label ?? p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setPreview(p)} className="p-2 rounded-lg text-gray-400 hover:text-[#00A19D] hover:bg-emerald-50 transition-colors" title="Preview"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => openEdit(p)} className="p-2 rounded-lg text-gray-400 hover:text-[#133A42] hover:bg-gray-100 transition-colors" title="Edit"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-8 overflow-y-auto" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 relative my-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-7">
              <h2 className="text-2xl font-bold text-[#133A42]">{editId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Image Upload Zone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Image *</label>
                <div
                  className={`relative border-2 border-dashed rounded-2xl transition-colors cursor-pointer ${dragOver ? 'border-[#00A19D] bg-emerald-50' : 'border-gray-200 hover:border-gray-300'} ${form.image_url ? 'p-2' : 'p-8'}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                >
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFilePick} />

                  {uploading ? (
                    <div className="flex flex-col items-center justify-center py-6 gap-3 text-[#00A19D]">
                      <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <p className="font-semibold text-sm">Uploading...</p>
                    </div>
                  ) : form.image_url ? (
                    <div className="relative group rounded-xl overflow-hidden">
                      <img src={form.image_url} className="w-full h-44 object-cover rounded-xl" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                        <p className="text-white font-bold text-sm flex items-center gap-2"><Upload className="w-4 h-4" /> Click or drag to replace</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-3 text-gray-400">
                      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 opacity-50" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-sm text-gray-600">Click or drag image here</p>
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — max 5MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Name *</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#00A19D] outline-none text-sm font-medium text-gray-800" placeholder="e.g. Velvet Cloud Armchair" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Harga (Rp) *</label>
                  <input required type="number" step="1000" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#00A19D] outline-none text-sm font-medium text-gray-800" placeholder="2500000" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Harga Asli / Coret (Rp)</label>
                  <input type="number" step="1000" value={form.sale_price ?? ''} onChange={e => setForm({...form, sale_price: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#00A19D] outline-none text-sm font-medium text-gray-800" placeholder="3500000" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#00A19D] outline-none text-sm font-medium text-gray-800 bg-white">
                    {['Furniture','Beds','Sofas','Chairs','Tables','Storage','Lighting','Decor'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#00A19D] outline-none text-sm font-medium text-gray-800 bg-white">
                    <option value="in_stock">In Stock</option>
                    <option value="sold_out">Sold Out</option>
                    <option value="new_in">New In</option>
                    <option value="on_sale">On Sale</option>
                  </select>
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
                  <textarea rows={2} value={form.description ?? ''} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#00A19D] outline-none text-sm font-medium text-gray-800 resize-none" placeholder="Short description..." />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={saving || uploading} className="flex items-center gap-2 bg-[#133A42] text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-[#00A19D] transition-colors disabled:opacity-50">
                  <Check className="w-4 h-4" /> {saving ? 'Saving...' : editId ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={() => setPreview(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreview(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            <img src={preview.image_url} className="w-full h-56 object-cover rounded-2xl mb-4 bg-gray-100" />
            <span className={`px-3 py-1 rounded-full border text-xs font-bold ${STATUS_LABELS[preview.status]?.color}`}>{STATUS_LABELS[preview.status]?.label}</span>
            <h3 className="text-lg font-bold text-[#133A42] mt-3 mb-1">{preview.name}</h3>
            {preview.description && <p className="text-sm text-gray-400 mb-3">{preview.description}</p>}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#00A19D]">{formatRupiah(preview.price)}</span>
              {preview.sale_price && <span className="text-gray-400 line-through text-sm">{formatRupiah(preview.sale_price)}</span>}
            </div>
            <p className="text-xs text-gray-400 mt-1">{preview.category}</p>
          </div>
        </div>
      )}
    </div>
  );
}
