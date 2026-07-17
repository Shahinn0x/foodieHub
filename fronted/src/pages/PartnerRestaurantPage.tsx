import { useEffect, useState } from "react"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import type { Restaurant } from "@/types"

export default function PartnerRestaurantPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    name: "", address: "", city: "", phone: "", category: "",
    openingTime: "09:00", closingTime: "22:00", deliveryTime: "30-45 min", image: ""
  })

  useEffect(() => {
    fetchRestaurant()
  }, [])

  async function fetchRestaurant() {
    try {
      const res = await api.get("/restaurant/all")
      setRestaurant(res.data[0] || null)
      if (res.data[0]) {
        const r = res.data[0]
        setForm({
          name: r.name, address: r.address, city: r.city, phone: r.phone, category: r.category || "",
          openingTime: r.openingTime, closingTime: r.closingTime, deliveryTime: r.deliveryTime, image: r.image || ""
        })
      }
    } catch {
      //
    } finally {
      setLoading(false)
    }
  }

  async function createOrUpdate() {
    try {
      if (restaurant) {
        const res = await api.put(`/restaurant/${restaurant._id}`, form)
        setRestaurant(res.data.restaurant)
        toast.success("Restaurant updated")
      } else {
        const res = await api.post("/restaurant/create", form)
        setRestaurant(res.data.restaurant)
        toast.success("Restaurant created")
      }
    } catch {
      toast.error("Failed to save")
    }
  }

  if (loading) return <div className="text-center py-12">Loading...</div>

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">{restaurant ? "Edit Restaurant" : "Create Restaurant"}</h1>

      <Card>
        <CardHeader><CardTitle>Restaurant Details</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label>Restaurant Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-1">
            <Label>Address</Label>
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>City</Label>
              <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Category</Label>
            <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. North Indian" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Opening Time</Label>
              <Input value={form.openingTime} onChange={(e) => setForm({ ...form, openingTime: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Closing Time</Label>
              <Input value={form.closingTime} onChange={(e) => setForm({ ...form, closingTime: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Delivery Time</Label>
            <Input value={form.deliveryTime} onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })} />
          </div>
          <div className="space-y-1">
            <Label>Image URL</Label>
            <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          </div>
          <Button className="w-full" onClick={createOrUpdate}>
            {restaurant ? "Update Restaurant" : "Create Restaurant"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
