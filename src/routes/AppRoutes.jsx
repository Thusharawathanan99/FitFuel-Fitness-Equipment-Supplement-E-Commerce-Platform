import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import AdminLayout from '../components/admin/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import Home from '../pages/customer/Home';
import Shop from '../pages/customer/Shop';
import ProductDetail from '../pages/customer/ProductDetail';
import Cart from '../pages/customer/Cart';

/* Heavier or less-travelled routes are split out of the first load. */
const Search = lazy(() => import('../pages/customer/Search'));
const Compare = lazy(() => import('../pages/customer/Compare'));
const Wishlist = lazy(() => import('../pages/customer/Wishlist'));
const Checkout = lazy(() => import('../pages/customer/Checkout'));
const OrderSuccess = lazy(() => import('../pages/customer/OrderSuccess'));
const Orders = lazy(() => import('../pages/customer/Orders'));
const OrderDetail = lazy(() => import('../pages/customer/OrderDetail'));
const Profile = lazy(() => import('../pages/customer/Profile'));
const Bmi = lazy(() => import('../pages/customer/Bmi'));
const Recommendations = lazy(() => import('../pages/customer/Recommendations'));
const NotFound = lazy(() => import('../pages/customer/NotFound'));

const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));

const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('../pages/admin/Products'));
const AdminProductForm = lazy(() => import('../pages/admin/ProductForm'));
const AdminCategories = lazy(() => import('../pages/admin/Categories'));
const AdminInventory = lazy(() => import('../pages/admin/Inventory'));
const AdminOrders = lazy(() => import('../pages/admin/Orders'));
const AdminCustomers = lazy(() => import('../pages/admin/Customers'));
const AdminAnalytics = lazy(() => import('../pages/admin/Analytics'));

const Fallback = () => (
  <div className="ff-wrap ff-sec">
    <span className="ff-sr" role="status">Loading page</span>
    <div className="ff-skel" style={{ height: 320 }} />
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="category/:slug" element={<Shop />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="search" element={<Search />} />
          <Route path="compare" element={<Compare />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="order-success/:id" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
          <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="bmi" element={<Bmi />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id/edit" element={<AdminProductForm />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
