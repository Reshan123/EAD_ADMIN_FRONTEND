import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { BookingProvider } from "./context/BookingContext";
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import Dashboard from "./pages/dashboard/Dashboard";
import BookingsPage from "./pages/bookings/BookingsPage";
import BookingEditPage from "./pages/bookings/BookingEditPage";
import StationsPage from "./pages/stations/StationsPage";
import StationCreatePage from "./pages/stations/StationCreatePage";
import StationEditPage from "./pages/stations/StationEditPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import { useAuth } from "./hooks/useAuth";
import { StationProvider } from "./context/StationContext";
import { UserProvider } from "./context/UserContext";
import UserPage from "./pages/users/UserPage";
import DeactivatedUsers from "./pages/deactivatedUsers/DeactivatedUsers"

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Layout Component
const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Fixed Navbar */}
      <div className="flex-shrink-0">
        <Navbar 
          onMenuToggle={handleMenuToggle} 
          isMobileMenuOpen={isMobileMenuOpen}
        />
      </div>
      
      {/* Main layout with sidebar and content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Fixed Sidebar */}
        <div className="flex-shrink-0">
          <Sidebar 
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        </div>
        
        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// App Router Component
const AppRouter = () => {
  return (
    <BrowserRouter>
      <UserProvider>
        <AuthProvider>
          <BookingProvider>
            <StationProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/bookings"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <BookingsPage />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/bookings/edit/:id"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <BookingEditPage />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                {/* Stations Routes */}
                <Route
                  path="/stations"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <StationsPage />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/stations/create"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <StationCreatePage />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/stations/edit/:id"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <StationEditPage />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                 <Route
                  path="/users"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <UserPage />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/deactivated-users"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <DeactivatedUsers />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </StationProvider>
          </BookingProvider>
        </AuthProvider>
      </UserProvider>
    </BrowserRouter>
  );
};

export default AppRouter;
