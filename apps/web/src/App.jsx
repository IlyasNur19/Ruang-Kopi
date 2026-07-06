import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastProvider, ToastViewport } from './components/ui/toast';
import Home from './pages/Home';
import KotakGagasanPage from './pages/KotakGagasanPage';
import MenuPage from './pages/MenuPage';
import GalleryPage from './pages/GalleryPage';
import ReservationPage from './pages/ReservationPage';
import LocationPage from './pages/LocationPage';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';
import POSPage from './pages/POSPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
        <Routes>
          {}
          <Route path="/" element={<Home />} />
          <Route path="/kotak-gagasan" element={<KotakGagasanPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/reservation" element={<ReservationPage />} />
          <Route path="/location" element={<LocationPage />} />

          {}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />

          {}
          <Route
            path="/pos"
            element={
              <ProtectedRoute>
                <POSPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        <ToastViewport />
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
