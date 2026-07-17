import { useEffect, useState } from "react"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DashboardData } from "@/types"

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    api.get("/admin/dashboard").then((r) => setData(r.data)).catch(() => {})
  }, [])

  if (!data) return <div className="text-center py-12">Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{data.totalUsers}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Restaurants</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{data.totalRestaurants}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Orders</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{data.totalOrders}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">₹{data.totalRevenue}</p></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Top Selling Items</CardTitle></CardHeader>
          <CardContent>
            {data.topSelling.length === 0 ? (
              <p className="text-muted-foreground">No data yet</p>
            ) : (
              <div className="space-y-2">
                {data.topSelling.map((item, i) => (
                  <div key={i} className="flex justify-between py-2 border-b last:border-0">
                    <span>{item.name}</span>
                    <span className="font-medium">{item.totalQuantity} sold</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>
          <CardContent>
            {data.recentOrders.length === 0 ? (
              <p className="text-muted-foreground">No orders yet</p>
            ) : (
              <div className="space-y-2">
                {data.recentOrders.map((order) => (
                  <div key={order._id} className="flex justify-between py-2 border-b last:border-0 text-sm">
                    <div>
                      <p className="font-medium">₹{order.totalPrice}</p>
                      <p className="text-muted-foreground">{order.status}</p>
                    </div>
                    <span className="text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
