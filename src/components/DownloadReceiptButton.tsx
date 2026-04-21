'use client';

import { Download, Printer } from 'lucide-react';
import { useState } from 'react';

export default function DownloadReceiptButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const htmlToImage = await import('html-to-image');
      
      const jsPDFModule: any = await import('jspdf');
      const JsPDFClass = jsPDFModule.default || jsPDFModule.jsPDF;

      const element = document.getElementById('receipt-wrapper');
      if (!element) return;

      const actionsEl = document.getElementById('receipt-actions');
      if (actionsEl) actionsEl.style.display = 'none';

      // html-to-image supports modern CSS colors like oklch and lab correctly!
      const imgData = await htmlToImage.toPng(element, { 
        backgroundColor: '#ffffff', 
        pixelRatio: 2,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        }
      });

      // Get original DOM dimensions
      const originalW = element.offsetWidth;
      const originalH = element.offsetHeight;

      const pdf = new JsPDFClass('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (originalH * pdfWidth) / originalW;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Faktur-${orderId}.pdf`);

      if (actionsEl) actionsEl.style.display = 'flex';
    } catch (e: any) {
      console.error(e);
      alert('Gagal mendownload PDF. Error: ' + (e?.message || e));
      const actionsEl = document.getElementById('receipt-actions');
      if (actionsEl) actionsEl.style.display = 'flex';
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="receipt-actions" className="flex flex-col sm:flex-row gap-4 relative z-10 pt-4 print:hidden">
      <button onClick={handlePrint} className="flex-1 flex items-center justify-center gap-2 text-center font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 py-4 rounded-full transition-colors text-sm">
        <Printer className="w-4 h-4" /> Print Resi
      </button>
      <button onClick={handleDownload} disabled={loading} className="flex-1 flex items-center justify-center gap-2 font-bold text-white bg-[#133A42] hover:bg-[#00A19D] py-4 rounded-full transition-colors shadow-lg shadow-[#133A42]/20 text-sm">
        <Download className="w-4 h-4" /> {loading ? 'Membuat PDF...' : 'Download PDF'}
      </button>
    </div>
  );
}
