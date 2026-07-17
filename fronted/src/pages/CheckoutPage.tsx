import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import type { Address, CartItem } from "@/types"

export default function CheckoutPage() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("COD")
  const [loading, setLoading] = useState(true)

  const [newAddress, setNewAddress] = useState({ name: "", phone: "", address: "", city: "", state: "", pincode: "" })
  const [showNewAddress, setShowNewAddress] = useState(false)

  useEffect(() => {
    Promise.all([api.get("/cart"), api.get("/address")])
      .then(([cartRes, addrRes]) => {
        setCartItems(cartRes.data.items)
        setTotalPrice(cartRes.data.totalPrice)
        setAddresses(addrRes.data)
        if (addrRes.data.length > 0) setSelectedAddress(addrRes.data[0]._id)
      })
      .catch(() => toast.error("Please login and add items to cart"))
      .finally(() => setLoading(false))
  }, [])

  async function addAddress() {
    try {
      const res = await api.post("/address", newAddress)
      setAddresses([...addresses, res.data.address])
      setSelectedAddress(res.data.address._id)
      setShowNewAddress(false)
      toast.success("Address added")
    } catch {
      toast.error("Failed to add address")
    }
  }

  async function placeOrder() {
    if (!selectedAddress) {
      toast.error("Select a delivery address")
      return
    }
    try {
      await api.post("/order/create", { addressId: selectedAddress, paymentMethod })
      toast.success("Order placed successfully!")
      navigate("/orders")
    } catch {
      toast.error("Failed to place order")
    }
  }

  if (loading) return <div className="text-center py-12">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <Card className="mb-4">
        <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
        <CardContent>
          {cartItems.map((item) => (
            <div key={item.food._id} className="flex justify-between py-2 border-b last:border-0">
              <div>
                <span className="font-medium">{item.food.name}</span>
                <Badge variant="secondary" className="ml-2 text-xs">{item.food.isVeg ? "Veg" : "Non-Veg"}</Badge>
                <span className="text-sm text-muted-foreground ml-2">x{item.quantity}</span>
              </div>
              <span>₹{item.food.price * item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t">
            <span>Total</span><span>₹{totalPrice}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Delivery Address</CardTitle>
          <Button variant="link" onClick={() => setShowNewAddress(!showNewAddress)}>
            {showNewAddress ? "Cancel" : "+ Add New"}
          </Button>
        </CardHeader>
        <CardContent>
          {showNewAddress && (
            <div className="space-y-3 mb-4 p-4 border rounded-md">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Name</Label>
                  <Input value={newAddress.name} onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Phone</Label>
                  <Input value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Address</Label>
                <Input value={newAddress.address} onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label>City</Label>
                  <Input value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>State</Label>
                  <Input value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Pincode</Label>
                  <Input value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} />
                </div>
              </div>
              <Button onClick={addAddress} className="w-full">Save Address</Button>
            </div>
          )}

          {addresses.length === 0 && !showNewAddress && (
            <p className="text-muted-foreground text-sm">No saved addresses. Add one above.</p>
          )}

          <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress} className="space-y-2">
            {addresses.map((addr) => (
              <div key={addr._id} className="flex items-start gap-2 p-3 border rounded-md">
                <RadioGroupItem value={addr._id} id={addr._id} />
                <Label htmlFor={addr._id} className="cursor-pointer">
                  <p className="font-medium">{addr.name} - {addr.phone}</p>
                  <p className="text-sm text-muted-foreground">{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader><CardTitle>Payment Method</CardTitle></CardHeader>
        <CardContent>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="COD">Cash on Delivery</SelectItem>
              <SelectItem value="UPI">UPI</SelectItem>
              <SelectItem value="CARD">Card</SelectItem>
              <SelectItem value="NETBANKING">Net Banking</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Button className="w-full" size="lg" onClick={placeOrder} disabled={cartItems.length === 0}>
        Place Order - ₹{totalPrice}
      </Button>
    </div>
  )
}
