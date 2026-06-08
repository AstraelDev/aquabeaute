import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layout Shared Elements
import Header from './components/Header';
import Footer from './components/Footer';

// Client Views
import Home from './pages/Home';
import CarePage from './pages/CarePage';
import Boutique from './pages/Boutique';
import UserAccount from './pages/UserAccount';

// Admin Views
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

/**
 * Route protector wrapper for admin operations
 */
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  if (!user || !user.isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

/**
 * Structural helper to selectively hide standard client Header and Footer
 * on exclusive admin directories.
 */
const LayoutDispatcher: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Header />}
      
      <main className="flex-1">
        <Routes>
          {/* Client Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/soin-visage" element={<CarePage categoryId="visage" />} />
          <Route path="/soin-corps" element={<CarePage categoryId="corps" />} />
          <Route path="/epilation" element={<CarePage categoryId="epilation" />} />
          <Route path="/methodes-amincissantes" element={<CarePage categoryId="minceur" />} />
          <Route path="/espace-beaute" element={<CarePage categoryId="espace-beaute" />} />
          <Route path="/mains-pieds" element={<CarePage categoryId="mains-pieds" />} />
          <Route path="/boutique" element={<Boutique />} />
          <Route path="/mon-compte" element={<UserAccount />} />

          {/* Admin Pages (Separate Layouts) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <LayoutDispatcher />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
