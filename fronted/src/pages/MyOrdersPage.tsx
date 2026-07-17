import { useEffect, useState } from "react"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { Order } from "@/types"

const statusColors: Record<string, string> = {
  Placed: "bg-blue-500",
  Accepted: "bg-yellow-500",
  Preparing: "bg-orange-500",
  "Out For Delivery": "bg-purple-500",
  Delivered: "bg-green-500",
  Cancelled: "bg-red-500",
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    api.get("/order/my-orders")
      .then((r) => setOrders(r.data))
      .catch(() => {})
  }, [])

  async function cancelOrder(id: string) {
    try {
      await api.put(`/order/cancel/${id}`)
      toast.success("Order cancelled")
      setOrders(orders.map((o) => (o._id === id ? { ...o, status: "Cancelled" } : o)))
    } catch {
      toast.error("Cannot cancel this order")
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No orders yet</p>
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order._id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">
                {typeof order.restaurant === "object" && order.restaurant !== null
                  ? (order.restaurant as { name?: string }).name
                  : "Restaurant"}
              </CardTitle>
              <Badge className={statusColors[order.status] || ""}>{order.status}</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{item.name} x{item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold pt-2 border-t mt-2">
                  <span>Total</span><span>₹{order.totalPrice}</span>
                </div>
                <p className="text-muted-foreground mt-2">
                  <span className="font-medium">Payment:</span> {order.paymentMethod}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium">To:</span> {order.deliveryAddress.name}, {order.deliveryAddress.address}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
                {order.status === "Placed" && (
                  <Button variant="destructive" size="sm" className="mt-2" onClick={() => cancelOrder(order._id)}>
                    Cancel Order
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
