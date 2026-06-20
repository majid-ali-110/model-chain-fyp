import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { WalletProvider } from './contexts/WalletContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ModelProvider } from './contexts/ModelContext';
import { UserProvider } from './contexts/UserContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import CleanLayout from './layouts/CleanLayout';
import AdminLayout from './layouts/AdminLayout';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/common/ScrollToTop';

// Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// Wallet Connection Page
import ConnectWallet from './pages/ConnectWallet';

// Marketplace Pages
import Models from './pages/marketplace/Models';
import ModelDetail from './pages/marketplace/ModelDetail';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import MyModels from './pages/dashboard/MyModels';
import Notifications from './pages/dashboard/Notifications';

// Developer Pages
import Upload from './pages/developer/Upload';
import DeveloperMyModels from './pages/developer/MyModels';

// Validator Pages
import ValidatorDashboard from './pages/validator/Dashboard';
import ValidatorReview from './pages/validator/Review';

// Sandbox Page
import Sandbox from './pages/sandbox/Sandbox';

// Admin Pages
import AdminOverview from './pages/admin/Overview';

// Wallet Pages
import WalletDashboard from './pages/wallet/WalletDashboard';

// Profile Pages
import Profile from './pages/profile/Profile';
import Settings from './pages/profile/Settings';
import EditProfile from './pages/profile/EditProfile';

// Legal Pages
import Terms from './pages/legal/Terms';
import Privacy from './pages/legal/Privacy';

// Governance Page
import Governance from './pages/governance/Governance';

// Info Pages
import FAQ from './pages/FAQ';

import WalletAuthSync from './components/auth/WalletAuthSync';

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <WalletProvider>
          <AuthProvider>
            <ModelProvider>
              <UserProvider>
                <WalletAuthSync />
                <Router>
                  <ScrollToTop />
                  <div className="min-h-screen bg-dark-bg-primary text-dark-text-primary">
                    <Routes>
                      {/* Public Routes with Main Layout */}
                      <Route path="/" element={<MainLayout />}>
                        <Route index element={<Home />} />

                        {/* Marketplace Routes */}
                        <Route path="marketplace">
                          <Route index element={<Models />} />
                          <Route path="models" element={<Models />} />
                          <Route path="models/:id" element={<ModelDetail />} />
                        </Route>

                        {/* Sandbox Route */}
                        <Route path="sandbox" element={<Sandbox />} />

                        {/* Governance Route */}
                        <Route path="governance" element={<Governance />} />

                        {/* Notifications Route */}
                        <Route path="notifications" element={<Notifications />} />

                        {/* Profile Routes */}
                        <Route path="profile" element={<Profile />} />
                        <Route path="profile/:userId" element={<Profile />} />
                        <Route path="profile/edit" element={
                          <ProtectedRoute>
                            <EditProfile />
                          </ProtectedRoute>
                        } />
                        <Route path="settings" element={<Settings />} />

                        {/* Legal Routes */}
                        <Route path="terms" element={<Terms />} />
                        <Route path="privacy" element={<Privacy />} />
                        <Route path="faq" element={<FAQ />} />
                      </Route>

                      {/* Wallet Connection Route */}
                      <Route path="connect-wallet" element={<ConnectWallet />} />

                      {/* Protected Dashboard Routes */}
                      <Route path="/dashboard" element={
                        <ProtectedRoute>
                          <CleanLayout />
                        </ProtectedRoute>
                      }>
                        <Route index element={<Dashboard />} />
                        <Route path="models" element={<MyModels />} />
                      </Route>

                      {/* Protected Developer Routes */}
                      <Route path="/developer" element={
                        <ProtectedRoute developerOnly>
                          <DashboardLayout />
                        </ProtectedRoute>
                      }>
                        <Route path="models" element={<DeveloperMyModels />} />
                        <Route path="upload" element={<Upload />} />
                      </Route>

                      {/* Protected Validator Routes */}
                      <Route path="/validator" element={
                        <ProtectedRoute validatorOnly>
                          <DashboardLayout />
                        </ProtectedRoute>
                      }>
                        <Route index element={<ValidatorDashboard />} />
                        <Route path="dashboard" element={<ValidatorDashboard />} />
                        <Route path="review/:modelId" element={<ValidatorReview />} />
                      </Route>

                      {/* Protected Admin Routes */}
                      <Route path="/admin" element={
                        <ProtectedRoute adminOnly>
                          <AdminLayout />
                        </ProtectedRoute>
                      }>
                        <Route path="overview" element={<AdminOverview />} />
                      </Route>

                      {/* Protected Wallet Routes */}
                      <Route path="/wallet" element={<MainLayout />}>
                        <Route index element={
                          <ProtectedRoute>
                            <WalletDashboard />
                          </ProtectedRoute>
                        } />
                      </Route>

                      {/* 404 Route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                </Router>
              </UserProvider>
            </ModelProvider>
          </AuthProvider>
        </WalletProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}


export default App;
