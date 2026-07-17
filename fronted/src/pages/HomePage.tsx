import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { AiSearchIcon, HonourStarIcon, Clock01Icon } from "@hugeicons/core-free-icons"
import type { Restaurant } from "@/types"

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [sort, setSort] = useState("")
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    fetchRestaurants()
  }, [search, category, sort])

  async function fetchRestaurants() {
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (category) params.set("category", category)
      if (sort) params.set("sort", sort)
      const res = await api.get(`/restaurant/all?${params.toString()}`)
      setRestaurants(res.data)
      const cats = [...new Set(res.data.map((r: Restaurant) => r.category).filter(Boolean))] as string[]
      setCategories(cats)
    } catch {
      // silent
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Restaurants near you</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <HugeiconsIcon icon={AiSearchIcon} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search restaurants..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Default</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="deliveryTime">Delivery Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {restaurants.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No restaurants found</p>
          {search && <Button variant="link" onClick={() => setSearch("")}>Clear search</Button>}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {restaurants.map((r) => (
          <Link key={r._id} to={`/restaurant/${r._id}`}>
            <Card className="hover:shadow-md transition-shadow h-full">
              <CardContent className="p-4">
                <div className="h-40 bg-muted rounded-md mb-3 flex items-center justify-center overflow-hidden">
                  {r.image ? (
                    <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">🍽️</span>
                  )}
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{r.name}</h3>
                    <p className="text-sm text-muted-foreground">{r.city}</p>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <HugeiconsIcon icon={HonourStarIcon} className="h-3 w-3" /> {r.rating || "New"}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <HugeiconsIcon icon={Clock01Icon} className="h-3.5 w-3.5" /> {r.deliveryTime}
                  </span>
                  <Badge variant="outline">{r.category}</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
