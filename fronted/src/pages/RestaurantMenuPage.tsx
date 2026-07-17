import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import api from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Clock01Icon, HonourStarIcon, ChevronLeftIcon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import type { Restaurant, FoodItem } from "@/types"

export default function RestaurantMenuPage() {
  const { id } = useParams()
  const { role } = useAuth()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [menu, setMenu] = useState<FoodItem[]>([])

  useEffect(() => {
    api.get(`/restaurant/${id}`).then((r) => setRestaurant(r.data)).catch(() => {})
    api.get(`/food/restaurant/${id}`).then((r) => setMenu(r.data)).catch(() => {})
  }, [id])

  async function addToCart(foodId: string) {
    try {
      await api.post("/cart/add", { foodId, quantity: 1 })
      toast.success("Added to cart")
    } catch {
      toast.error("Login as a user to add items")
    }
  }

  return (
    <div>
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <HugeiconsIcon icon={ChevronLeftIcon} className="h-4 w-4" /> Back
      </Link>

      {restaurant && (
        <div className="mb-6">
          <div className="h-48 bg-muted rounded-lg mb-4 flex items-center justify-center overflow-hidden">
            {restaurant.image ? (
              <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-6xl">🍽️</span>
            )}
          </div>
          <h1 className="text-2xl font-bold">{restaurant.name}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><HugeiconsIcon icon={HonourStarIcon} className="h-4 w-4" /> {restaurant.rating || "New"}</span>
            <span className="flex items-center gap-1"><HugeiconsIcon icon={Clock01Icon} className="h-4 w-4" /> {restaurant.deliveryTime}</span>
            <Badge variant="outline">{restaurant.category}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{restaurant.address}, {restaurant.city}</p>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Menu</h2>

      {menu.length === 0 && (
        <p className="text-center py-12 text-muted-foreground">No items available yet</p>
      )}

      <div className="space-y-3">
        {menu.map((item) => (
          <Card key={item._id}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-20 w-20 bg-muted rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">{item.isVeg ? "🥗" : "🍗"}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{item.name}</h3>
                  <Badge variant="secondary" className="text-xs">{item.isVeg ? "Veg" : "Non-Veg"}</Badge>
                </div>
                {item.description && (
                  <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                )}
                <p className="font-semibold mt-1">₹{item.price}</p>
              </div>
              {role === "user" && (
                <Button size="sm" onClick={() => addToCart(item._id)}>
                  + Add
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
