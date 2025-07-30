'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  reloadCount: number;
  isReloading: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      reloadCount: 0,
      isReloading: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Component stack:', errorInfo.componentStack);
    
    // Handle different types of errors
    const isChunkError = error.name === 'ChunkLoadError' || error.message.includes('Loading chunk');
    const isSyntaxError = error.name === 'SyntaxError' || error.message.includes('missing )');
    
    if (isChunkError || isSyntaxError) {
      console.error(`${isSyntaxError ? 'Syntax' : 'Chunk loading'} error detected - checking reload count...`);
      
      const currentReloadCount = this.state.reloadCount;
      const maxReloads = 1; // Reduce to 1 reload attempt for syntax errors
      
      if (currentReloadCount < maxReloads) {
        console.error(`Attempting reload ${currentReloadCount + 1}/${maxReloads}...`);
        this.setState({ 
          isReloading: true,
          reloadCount: currentReloadCount + 1 
        });
        
        // Force a page reload to recover from chunk loading issues
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        console.error('Maximum reload attempts reached, showing error UI');
        this.setState({ isReloading: false });
      }
    }
    
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      reloadCount: 0,
      isReloading: false
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleManualReload = () => {
    this.setState({ isReloading: true });
    window.location.reload();
  };

  handleClearCache = () => {
    // Clear browser cache and reload
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    // Clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    // Reload the page
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isChunkError = this.state.error?.name === 'ChunkLoadError' || 
                          this.state.error?.message?.includes('Loading chunk');
      const isSyntaxError = this.state.error?.name === 'SyntaxError' || 
                           this.state.error?.message?.includes('missing )');

      // If we're in a reload loop, show a different message
      const isInReloadLoop = this.state.reloadCount >= 1;

      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2 text-red-400">
              {isSyntaxError ? 'JavaScript Syntax Error' : 
               isInReloadLoop ? 'Persistent Loading Issue' : 'Loading Issue Detected'}
            </h2>
            <p className="text-gray-400 mb-6">
              {isSyntaxError 
                ? 'A JavaScript syntax error was detected. This might be due to a corrupted cache or browser issue.'
                : isInReloadLoop 
                  ? 'We\'re experiencing persistent loading issues. This might be due to browser cache or network problems. Please try clearing your browser cache or using a different browser.'
                  : isChunkError 
                    ? 'We detected a loading issue with the dashboard. The page will automatically reload to fix this.'
                    : 'We encountered an unexpected error while loading the dashboard. This might be due to a temporary issue with data loading.'
              }
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-blue-400 mb-2">
                  Error Details (Development)
                </summary>
                <div className="bg-gray-800 p-4 rounded text-sm overflow-auto">
                  <p className="text-red-400 mb-2">{this.state.error.message}</p>
                  <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                    {this.state.error.stack}
                  </pre>
                </div>
              </details>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {!this.state.isReloading && (
                <>
                  <Button 
                    onClick={this.handleRetry} 
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  <Button 
                    onClick={this.handleClearCache} 
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Clear Cache & Reload
                  </Button>
                  <Button 
                    onClick={this.handleManualReload} 
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reload Page
                  </Button>
                  <Button 
                    onClick={this.handleGoHome} 
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                </>
              )}
              
              {this.state.isReloading && (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mr-2"></div>
                  <span className="text-blue-400">Reloading...</span>
                </div>
              )}
            </div>
            
            {(isInReloadLoop || isSyntaxError) && (
              <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded text-sm">
                <p className="text-yellow-400 mb-2">💡 Troubleshooting Tips:</p>
                <ul className="text-yellow-300 text-left space-y-1">
                  <li>• Clear browser cache and cookies</li>
                  <li>• Try a different browser</li>
                  <li>• Check your internet connection</li>
                  <li>• Disable browser extensions</li>
                  {isSyntaxError && <li>• Try incognito/private browsing mode</li>}
                </ul>
              </div>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
} 