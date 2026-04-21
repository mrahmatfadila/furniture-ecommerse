'use client';

import dynamic from 'next/dynamic';

const DownloadReceiptButton = dynamic(() => import('./DownloadReceiptButton'), {
  ssr: false,
});

export default function DownloadReceiptWrapper({ orderId }: { orderId: string }) {
  return <DownloadReceiptButton orderId={orderId} />;
}
