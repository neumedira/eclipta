import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import PortfolioPage from './pages/PortfolioPage';
import PortfolioDetailPage from './pages/PortfolioDetailPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AboutAdmin from './pages/admin/AboutAdmin';
import PortfolioAdmin from './pages/admin/PortfolioAdmin';
import BlogAdmin from './pages/admin/BlogAdmin';

// Komponen untuk scroll ke atas
const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null; // Komponen ini tidak merender apa pun
};

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop /> {/* Tambahkan di sini, di dalam Router */}
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/portfolio/:id" element={<PortfolioDetailPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogDetailPage />} />
              <Route path="/admin/login" element={<LoginPage />} />
              <Route path="/logout" element={<LogoutPage />} />
              
              {/* Protected Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/about" 
                element={
                  <ProtectedRoute>
                    <AboutAdmin />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/portfolio" 
                element={
                  <ProtectedRoute>
                    <PortfolioAdmin />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/blog" 
                element={
                  <ProtectedRoute>
                    <BlogAdmin />
                  </ProtectedRoute>
                } 
              />
              
              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;