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
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/common/ScrollToTop';

// Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Marketplace Pages
import Models from './pages/marketplace/Models';
import ModelDetail from './pages/marketplace/ModelDetail';
import Browse from './pages/marketplace/Browse';
import Categories from './pages/marketplace/Categories';

// Dashboard Pages
import Dashboard from './pages/dashboard/DashboardClean';
import Overview from './pages/dashboard/Overview';
import MyModels from './pages/dashboard/MyModels';
import Notifications from './pages/dashboard/Notifications';

// Developer Pages
import Upload from './pages/developer/Upload';
import Analytics from './pages/developer/Analytics';
import DeveloperMyModels from './pages/developer/MyModels';

// Validator Pages
import ValidatorDashboard from './pages/validator/Dashboard';

// Sandbox Page
import Sandbox from './pages/sandbox/Sandbox';

// Admin Pages
import AdminOverview from './pages/admin/Overview';

// Wallet Pages
import WalletOverview from './pages/wallet/Overview';
import WalletDashboard from './pages/wallet/WalletDashboard';

// Profile Pages
import Profile from './pages/profile/Profile';
import Settings from './pages/profile/Settings';

// Legal Pages
import Terms from './pages/legal/Terms';
import Privacy from './pages/legal/Privacy';
import Security from './pages/legal/Security';

// Governance Page
import Governance from './pages/governance/Governance';

// Documentation Pages
import ApiDocumentation from './pages/docs/ApiDocumentation';
import SdkTools from './pages/docs/SdkTools';
import ValidationGuidelines from './pages/docs/ValidationGuidelines';
import NodeSetup from './pages/docs/NodeSetup';

// Validator Pages (additional)
import Leaderboard from './pages/validator/Leaderboard';
import RewardsProgram from './pages/validator/RewardsProgram';

// Info Pages
import About from './pages/About';
import FAQ from './pages/FAQ';
import { Blog, Careers, Contact, Press, Status, Community, Documentation, Support, DeveloperSupport, CookiePolicy } from './pages/TemplatePagesindex';

import './App.css';

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <WalletProvider>
          <AuthProvider>
            <ModelProvider>
              <UserProvider>
                <Router>
                  <ScrollToTop />
                  <div style={{ minHeight: '100vh', backgroundColor: '#0a0c10', color: '#ffffff' }}>
                    <Routes>
                      {/* Public Routes with Main Layout */}
                      <Route path="/" element={<MainLayout />}>
                        <Route index element={<Home />} />
                        
                        {/* Marketplace Routes */}
                        <Route path="marketplace">
                          <Route index element={<Browse />} />
                          <Route path="models" element={<Models />} />
                          <Route path="models/:id" element={<ModelDetail />} />
                          <Route path="browse" element={<Browse />} />
                          <Route path="categories" element={<Categories />} />
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
                        <Route path="settings" element={<Settings />} />

                        {/* Legal Routes */}
                        <Route path="terms" element={<Terms />} />
                        <Route path="privacy" element={<Privacy />} />
                        <Route path="cookies" element={<CookiePolicy />} />
                        <Route path="security" element={<Security />} />
                        <Route path="faq" element={<FAQ />} />

                        {/* Documentation Routes */}
                        <Route path="docs">
                          <Route index element={<Documentation />} />
                          <Route path="api" element={<ApiDocumentation />} />
                          <Route path="sdk" element={<SdkTools />} />
                          <Route path="validation" element={<ValidationGuidelines />} />
                          <Route path="node-setup" element={<NodeSetup />} />
                        </Route>

                        {/* Company/Info Routes */}
                        <Route path="about" element={<About />} />
                        <Route path="blog" element={<Blog />} />
                        <Route path="careers" element={<Careers />} />
                        <Route path="contact" element={<Contact />} />
                        <Route path="press" element={<Press />} />
                        
                        {/* Support/Community Routes */}
                        <Route path="status" element={<Status />} />
                        <Route path="community" element={<Community />} />
                        <Route path="support">
                          <Route index element={<Support />} />
                          <Route path="developers" element={<DeveloperSupport />} />
                        </Route>

                        {/* Validator Public Routes */}
                        <Route path="validator">
                          <Route path="leaderboard" element={<Leaderboard />} />
                          <Route path="rewards" element={<RewardsProgram />} />
                        </Route>
                      </Route>

                      {/* Auth Routes with Auth Layout */}
                      <Route path="/" element={<AuthLayout />}>
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                        <Route path="forgot-password" element={<ForgotPassword />} />
                      </Route>

                      {/* Protected Dashboard Routes - Clean Layout (No Sidebar) */}
                      <Route path="/dashboard" element={
                        <ProtectedRoute>
                          <CleanLayout />
                        </ProtectedRoute>
                      }>
                        <Route index element={<Dashboard />} />
                        <Route path="overview" element={<Overview />} />
                        <Route path="models" element={<MyModels />} />
                      </Route>

                      {/* Protected Developer Routes */}
                      <Route path="/developer" element={<MainLayout />}>
                        <Route path="models" element={
                          <ProtectedRoute developerOnly>
                            <DeveloperMyModels />
                          </ProtectedRoute>
                        } />
                        <Route path="upload" element={
                          <ProtectedRoute developerOnly>
                            <Upload />
                          </ProtectedRoute>
                        } />
                        <Route path="analytics" element={
                          <ProtectedRoute developerOnly>
                            <Analytics />
                          </ProtectedRoute>
                        } />
                        <Route path="analytics/:modelId" element={
                          <ProtectedRoute developerOnly>
                            <Analytics />
                          </ProtectedRoute>
                        } />
                      </Route>

                      {/* Protected Validator Routes */}
                      <Route path="/validator" element={
                        <ProtectedRoute validatorOnly>
                          <DashboardLayout />
                        </ProtectedRoute>
                      }>
                        <Route index element={<ValidatorDashboard />} />
                        <Route path="dashboard" element={<ValidatorDashboard />} />
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
                        <Route path="overview" element={
                          <ProtectedRoute>
                            <WalletOverview />
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
}export default App;
