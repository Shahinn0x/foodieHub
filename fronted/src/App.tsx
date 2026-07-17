import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "@/contexts/AuthContext"
import { Toaster } from "@/components/ui/sonner"
import Layout from "@/components/Layout"
import HomePage from "@/pages/HomePage"
import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"
import RestaurantMenuPage from "@/pages/RestaurantMenuPage"
import CartPage from "@/pages/CartPage"
import CheckoutPage from "@/pages/CheckoutPage"
import MyOrdersPage from "@/pages/MyOrdersPage"
import PartnerOrdersPage from "@/pages/PartnerOrdersPage"
import PartnerFoodsPage from "@/pages/PartnerFoodsPage"
import PartnerRestaurantPage from "@/pages/PartnerRestaurantPage"
import AdminDashboardPage from "@/pages/AdminDashboardPage"

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/restaurant/:id" element={<RestaurantMenuPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<MyOrdersPage />} />
            <Route path="/partner/orders" element={<PartnerOrdersPage />} />
            <Route path="/partner/foods" element={<PartnerFoodsPage />} />
            <Route path="/partner/restaurant" element={<PartnerRestaurantPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Route>
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  )
}
