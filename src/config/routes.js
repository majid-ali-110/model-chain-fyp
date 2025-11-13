// Route definitions for ModelChain application
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  
  // Marketplace routes
  MARKETPLACE: '/marketplace',
  MODEL_DETAIL: '/marketplace/:id',
  
  // Sandbox routes
  SANDBOX: '/sandbox/:modelId',
  
  // Dashboard routes (protected)
  DASHBOARD: '/dashboard',
  DASHBOARD_PURCHASES: '/dashboard/purchases',
  DASHBOARD_MODELS: '/dashboard/models',
  DASHBOARD_EARNINGS: '/dashboard/earnings',
  DASHBOARD_REWARDS: '/dashboard/rewards',
  
  // Profile routes
  PROFILE: '/profile/:username',
  SETTINGS: '/settings',
  
  // Developer routes (protected, role-based)
  DEVELOPER_MODELS: '/developer/models',
  DEVELOPER_MODEL_ANALYTICS: '/developer/models/:id/analytics',
  DEVELOPER_TOOLS: '/developer/tools',
  DEVELOPER_UPLOAD: '/developer/upload',
  
  // Validator routes (protected, role-based)
  VALIDATOR_DASHBOARD: '/validator/dashboard',
  VALIDATOR_REVIEW: '/validator/review/:modelId',
  VALIDATOR_LEADERBOARD: '/validator/leaderboard',
  
  // Governance routes
  GOVERNANCE: '/governance',
  
  // Wallet routes (protected)
  WALLET_CONNECT: '/wallet/connect',
  WALLET_DASHBOARD: '/wallet/dashboard',
  WALLET_TRANSACTIONS: '/wallet/transactions',
  WALLET_PAYMENTS: '/wallet/payments',
  
  // Admin routes (protected, admin only)
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_MODELS: '/admin/models',
  ADMIN_DISPUTES: '/admin/disputes',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_SETTINGS: '/admin/settings',
  
  // Legal routes
  TERMS: '/terms',
  PRIVACY: '/privacy',
  FAQ: '/faq',
  
  // 404
  NOT_FOUND: '*'
};

// Route metadata for access control
export const ROUTE_CONFIG = {
  // Public routes - no authentication required
  PUBLIC_ROUTES: [
    ROUTES.HOME,
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.FORGOT_PASSWORD,
    ROUTES.MARKETPLACE,
    ROUTES.MODEL_DETAIL,
    ROUTES.SANDBOX,
    ROUTES.GOVERNANCE,
    ROUTES.TERMS,
    ROUTES.PRIVACY,
    ROUTES.FAQ,
    ROUTES.PROFILE
  ],
  
  // Protected routes - authentication required
  PROTECTED_ROUTES: [
    ROUTES.DASHBOARD,
    ROUTES.DASHBOARD_PURCHASES,
    ROUTES.DASHBOARD_MODELS,
    ROUTES.DASHBOARD_EARNINGS,
    ROUTES.DASHBOARD_REWARDS,
    ROUTES.SETTINGS,
    ROUTES.WALLET_CONNECT,
    ROUTES.WALLET_DASHBOARD,
    ROUTES.WALLET_TRANSACTIONS,
    ROUTES.WALLET_PAYMENTS
  ],
  
  // Developer routes - developer role required
  DEVELOPER_ROUTES: [
    ROUTES.DEVELOPER_MODELS,
    ROUTES.DEVELOPER_MODEL_ANALYTICS,
    ROUTES.DEVELOPER_TOOLS,
    ROUTES.DEVELOPER_UPLOAD
  ],
  
  // Validator routes - validator role required
  VALIDATOR_ROUTES: [
    ROUTES.VALIDATOR_DASHBOARD,
    ROUTES.VALIDATOR_REVIEW,
    ROUTES.VALIDATOR_LEADERBOARD
  ],
  
  // Admin routes - admin role required
  ADMIN_ROUTES: [
    ROUTES.ADMIN_DASHBOARD,
    ROUTES.ADMIN_USERS,
    ROUTES.ADMIN_MODELS,
    ROUTES.ADMIN_DISPUTES,
    ROUTES.ADMIN_ANALYTICS,
    ROUTES.ADMIN_SETTINGS
  ]
};

// Helper functions for route checking
export const isPublicRoute = (pathname) => {
  return ROUTE_CONFIG.PUBLIC_ROUTES.some(route => {
    if (route.includes(':')) {
      const pattern = route.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(pathname);
    }
    return route === pathname;
  });
};

export const isProtectedRoute = (pathname) => {
  return ROUTE_CONFIG.PROTECTED_ROUTES.includes(pathname);
};

export const isDeveloperRoute = (pathname) => {
  return ROUTE_CONFIG.DEVELOPER_ROUTES.some(route => pathname.startsWith(route.split(':')[0]));
};

export const isValidatorRoute = (pathname) => {
  return ROUTE_CONFIG.VALIDATOR_ROUTES.some(route => pathname.startsWith(route.split(':')[0]));
};

export const isAdminRoute = (pathname) => {
  return ROUTE_CONFIG.ADMIN_ROUTES.some(route => pathname.startsWith(route.split(':')[0]));
};

export default ROUTES;