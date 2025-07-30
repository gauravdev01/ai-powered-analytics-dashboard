// Dashboard Loader Script
(function() {
  // Only run this script in the browser
  if (typeof window === 'undefined') return;
  
  // Wait for the page to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadDashboard);
  } else {
    loadDashboard();
  }
  
  function loadDashboard() {
    // Show loading message
    const body = document.body;
    body.innerHTML = `
      <div class="min-h-screen bg-black text-white flex items-center justify-center">
        <div class="text-center">
          <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <h2 class="text-2xl font-semibold mb-2">Loading Dashboard...</h2>
          <p class="text-gray-400">Initializing dashboard</p>
        </div>
      </div>
    `;
    
    // Load the dashboard component
    import('/DashboardClient').then(function(module) {
      const DashboardClient = module.default;
      const React = require('react');
      const ReactDOM = require('react-dom/client');
      
      // Create root and render dashboard
      const root = ReactDOM.createRoot(body);
      root.render(React.createElement(DashboardClient));
    }).catch(function(error) {
      console.error('Failed to load dashboard:', error);
      body.innerHTML = `
        <div class="min-h-screen bg-black text-white flex items-center justify-center">
          <div class="text-center">
            <h2 class="text-2xl font-semibold mb-2 text-red-400">Error Loading Dashboard</h2>
            <p class="text-gray-400 mb-4">Please refresh the page</p>
            <button onclick="window.location.reload()" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
              Retry
            </button>
          </div>
        </div>
      `;
    });
  }
})(); 