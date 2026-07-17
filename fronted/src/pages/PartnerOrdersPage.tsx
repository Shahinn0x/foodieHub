import { useEffect, useState } from "react"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import type { Order } from "@/types"

const statuses = ["Placed", "Accepted", "Preparing", "Out For Delivery", "Delivered"]

export default function PartnerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    api.get("/partner/orders").then((r) => setOrders(r.data)).catch(() => {})
  }, [])

  async function updateStatus(orderId: string, status: string) {
    try {
      await api.put(`/partner/order/${orderId}`, { status })
      setOrders(orders.map((o) => (o._id === orderId ? { ...o, status } : o)))
      toast.success("Status updated")
    } catch {
      toast.error("Failed to update")
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Restaurant Orders</h1>

      {orders.length === 0 && (
        <p className="text-center py-16 text-muted-foreground">No orders received yet</p>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order._id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Order from {typeof order.user === "object" && (order.user as { fullName?: string }).fullName}
                </CardTitle>
                <Select value={order.status} onValueChange={(v) => updateStatus(order._id, v)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                <Badge variant="outline" className="mt-2">{order.paymentMethod}</Badge>
                <p className="text-muted-foreground mt-1">
                  Deliver to: {order.deliveryAddress.name}, {order.deliveryAddress.address}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
