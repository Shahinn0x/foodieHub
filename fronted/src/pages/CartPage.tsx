import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HugeiconsIcon } from "@hugeicons/react"
import { MinusSignIcon, PlusSignIcon, Delete02Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import type { CartItem } from "@/types"

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCart()
  }, [])

  async function fetchCart() {
    try {
      const res = await api.get("/cart")
      setItems(res.data.items)
      setTotalPrice(res.data.totalPrice)
    } catch {
      toast.error("Login to view cart")
    } finally {
      setLoading(false)
    }
  }

  async function updateQuantity(foodId: string, quantity: number) {
    if (quantity < 1) return
    try {
      await api.put(`/cart/update/${foodId}`, { quantity })
      fetchCart()
    } catch {
      toast.error("Failed to update")
    }
  }

  async function removeItem(foodId: string) {
    try {
      await api.delete(`/cart/remove/${foodId}`)
      fetchCart()
      toast.success("Removed from cart")
    } catch {
      toast.error("Failed to remove")
    }
  }

  async function clearCart() {
    try {
      await api.delete("/cart/clear")
      setItems([])
      setTotalPrice(0)
      toast.success("Cart cleared")
    } catch {
      toast.error("Failed to clear")
    }
  }

  if (loading) return <div className="text-center py-12">Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground mb-4">Your cart is empty</p>
          <Link to="/"><Button>Browse Restaurants</Button></Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.food._id}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{item.food.name}</h3>
                      <Badge variant="secondary" className="text-xs">{item.food.isVeg ? "Veg" : "Non-Veg"}</Badge>
                    </div>
                    <p className="font-semibold">₹{item.food.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon-sm" onClick={() => updateQuantity(item.food._id, item.quantity - 1)}>
                      <HugeiconsIcon icon={MinusSignIcon} className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button variant="outline" size="icon-sm" onClick={() => updateQuantity(item.food._id, item.quantity + 1)}>
                      <HugeiconsIcon icon={PlusSignIcon} className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="font-semibold w-20 text-right">₹{item.food.price * item.quantity}</p>
                  <Button variant="ghost" size="icon-sm" onClick={() => removeItem(item.food._id)}>
                    <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4 text-destructive" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 border-t pt-4 flex items-center justify-between">
            <Button variant="outline" onClick={clearCart}>Clear Cart</Button>
            <div className="text-right">
              <p className="text-lg font-bold">Total: ₹{totalPrice}</p>
              <Link to="/checkout">
                <Button className="mt-2">Proceed to Checkout</Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
