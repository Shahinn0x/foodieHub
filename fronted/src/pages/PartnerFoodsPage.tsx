import { useEffect, useState } from "react"
import api from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import type { FoodItem } from "@/types"

export default function PartnerFoodsPage() {
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "", isVeg: true, image: "" })

  useEffect(() => {
    fetchFoods()
  }, [])

  async function fetchFoods() {
    try {
      const r1 = await api.get("/restaurant/all?search=")
      const restaurants = r1.data

      const myR = restaurants.find((r: { owner: string }) => r.owner === (window as unknown as Record<string, unknown>)._partnerId)
      if (restaurants.length > 0) {
        const res = await api.get(`/food/restaurant/${restaurants[0]._id}`)
        setFoods(res.data)
      }
    } catch {
      toast.error("Create a restaurant first")
    }
  }

  async function addFood() {
    try {
      await api.post("/food/add", { ...form, price: Number(form.price) })
      setOpen(false)
      setForm({ name: "", description: "", price: "", category: "", isVeg: true, image: "" })
      fetchFoods()
      toast.success("Food item added")
    } catch {
      toast.error("Create a restaurant first")
    }
  }

  async function deleteFood(id: string) {
    try {
      await api.delete(`/food/${id}`)
      setFoods(foods.filter((f) => f._id !== id))
      toast.success("Deleted")
    } catch {
      toast.error("Failed to delete")
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Menu</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>+ Add Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Food Item</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Description</Label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Price (₹)</Label>
                  <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Category</Label>
                  <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Main Course" />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Image URL</Label>
                <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.isVeg} onChange={(e) => setForm({ ...form, isVeg: e.target.checked })} />
                <Label>Vegetarian</Label>
              </div>
              <Button className="w-full" onClick={addFood}>Add Item</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {foods.length === 0 && (
        <p className="text-center py-12 text-muted-foreground">No items in menu. Add your first item!</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {foods.map((food) => (
          <Card key={food._id}>
            <CardContent className="p-4">
              <div className="h-32 bg-muted rounded-md mb-3 flex items-center justify-center overflow-hidden">
                {food.image ? (
                  <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl">{food.isVeg ? "🥗" : "🍗"}</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{food.name}</h3>
                <Badge variant="secondary">{food.isVeg ? "Veg" : "Non-Veg"}</Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate">{food.description}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="font-bold">₹{food.price}</span>
                <Badge variant="outline">{food.category}</Badge>
              </div>
              <Button variant="destructive" size="sm" className="w-full mt-3" onClick={() => deleteFood(food._id)}>
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
