export interface User {
  _id: string
  fullName: string
  email: string
}

export interface FoodPartner {
  _id: string
  name: string
  email: string
  phone: string
  address: string
  contactName: string
}

export interface Restaurant {
  _id: string
  name: string
  owner: string | FoodPartner
  image: string
  address: string
  city: string
  phone: string
  category: string
  openingTime: string
  closingTime: string
  rating: number
  deliveryTime: string
  isOpen: boolean
}

export interface FoodItem {
  _id: string
  restaurant: string
  name: string
  description: string
  price: number
  category: string
  image: string
  isVeg: boolean
  available: boolean
}

export interface CartItem {
  food: FoodItem
  quantity: number
}

export interface Cart {
  _id: string
  user: string
  items: CartItem[]
}

export interface Address {
  _id: string
  user: string
  name: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
}

export interface OrderItem {
  food: string
  name: string
  price: number
  quantity: number
}

export interface Order {
  _id: string
  user: string | User
  restaurant: string | Restaurant
  items: OrderItem[]
  totalPrice: number
  deliveryAddress: {
    name: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
  }
  paymentMethod: 'COD' | 'UPI' | 'CARD' | 'NETBANKING'
  status: 'Placed' | 'Accepted' | 'Preparing' | 'Out For Delivery' | 'Delivered' | 'Cancelled'
  createdAt: string
}

export interface DashboardData {
  totalUsers: number
  totalRestaurants: number
  totalOrders: number
  totalRevenue: number
  recentOrders: Order[]
  topSelling: { name: string; totalQuantity: number }[]
}
