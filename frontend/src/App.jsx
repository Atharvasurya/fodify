import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import GroceryHome from './pages/GroceryHome';
import GlobalLocationModal from './components/GlobalLocationModal';
import Admin from './pages/Admin';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminReviews from './pages/admin/AdminReviews';
import AdminRestaurants from './pages/admin/AdminRestaurants';
import AdminFoods from './pages/admin/AdminFoods';
import AdminGroceryStores from './pages/admin/AdminGroceryStores';
import AdminGroceryItems from './pages/admin/AdminGroceryItems';
import AdminOffers from './pages/admin/AdminOffers';
import AdminSearch from './pages/admin/AdminSearch';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminAIDashboard from './pages/admin/AdminAIDashboard';
import AdminForecast from './pages/admin/AdminForecast';
import AdminMenuPerformance from './pages/admin/AdminMenuPerformance';
import AdminPricingInsights from './pages/admin/AdminPricingInsights';
import AdminCustomerSegments from './pages/admin/AdminCustomerSegments';
import AdminSentimentAnalysis from './pages/admin/AdminSentimentAnalysis';
import RestaurantDetails from './pages/RestaurantDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Orders from './pages/Orders';
import Offers from './pages/Offers';
import ScrollToTop from './components/ScrollToTop';
import RouteScrollToTop from './components/RouteScrollToTop';

/**
 * Layout Component - Handles conditional Navbar and Footer
 */
const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavAndFooter = location.pathname === '/' || location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavAndFooter && <Navbar />}
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      {!hideNavAndFooter && <Footer />}
      {!hideNavAndFooter && <BottomNav />}
    </div>
  );
};

/**
 * Main App Component
 * Routing and layout configuration
 */
function App() {
  return (
    <Router>
      <RouteScrollToTop />
      <Layout>
        <GlobalLocationModal />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/grocery" element={<GroceryHome />} />
          <Route path="/admin" element={<AdminLogin />} />

          {/* Protected Admin Routes with Layout */}
          <Route
            path="/admin/*"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="restaurants" element={<AdminRestaurants />} />
            <Route path="foods" element={<AdminFoods />} />
            <Route path="grocery-stores" element={<AdminGroceryStores />} />
            <Route path="grocery-items" element={<AdminGroceryItems />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="offers" element={<AdminOffers />} />
            <Route path="search" element={<AdminSearch />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="issues" element={<AdminDashboard />} />
            {/* AI Routes */}
            <Route path="ai-dashboard" element={<AdminAIDashboard />} />
            <Route path="forecast" element={<AdminForecast />} />
            <Route path="menu-performance" element={<AdminMenuPerformance />} />
            <Route path="pricing" element={<AdminPricingInsights />} />
            <Route path="segments" element={<AdminCustomerSegments />} />
            <Route path="sentiment" element={<AdminSentimentAnalysis />} />
          </Route>

          <Route path="/restaurant/:id" element={<RestaurantDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/offers" element={<Offers />} />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />

        {/* Scroll to Top Button */}
        <ScrollToTop />
      </Layout>
    </Router>
  );
}

export default App;
