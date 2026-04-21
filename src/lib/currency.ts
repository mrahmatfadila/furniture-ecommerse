/**
 * Format angka menjadi format Rupiah Indonesia
 * Contoh: 1500000 => "Rp 1.500.000"
 */
export function formatRupiah(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}
