'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Dynamically import the dashboard with optimized settings
const DashboardClient = dynamic(() => import('./DashboardClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto mb-4"></div>
        <h2 className="text-2xl font-semibold mb-2">Loading Dashboard...</h2>
        <p className="text-gray-400">Initializing dashboard</p>
      </div>
    </div>
  ),
});

// Add global error handler for chunk loading
const ChunkErrorHandler = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const handleChunkError = (event: ErrorEvent) => {
      if (event.error?.name === 'ChunkLoadError' || event.message?.includes('Loading chunk')) {
        console.error('Global chunk loading error detected:', event);
        // Don't automatically reload, let the error boundary handle it
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.name === 'ChunkLoadError' || event.reason?.message?.includes('Loading chunk')) {
        console.error('Global chunk loading promise rejection:', event);
      }
    };

    window.addEventListener('error', handleChunkError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleChunkError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return <>{children}</>;
};

export default function DashboardPage() {
  return (
    <ChunkErrorHandler>
      <ErrorBoundary>
        <Suspense fallback={
          <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <h2 className="text-2xl font-semibold mb-2">Loading Dashboard...</h2>
              <p className="text-gray-400">Initializing dashboard</p>
            </div>
          </div>
        }>
          <DashboardClient />
        </Suspense>
      </ErrorBoundary>
    </ChunkErrorHandler>
  );
}