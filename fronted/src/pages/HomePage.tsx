import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { AiSearchIcon, HonourStarIcon, Clock01Icon, Location01Icon, DeliveryTruck01Icon, HeadsetIcon, SpoonIcon } from "@hugeicons/core-free-icons"
import type { Restaurant } from "@/types"

const features = [
  { icon: DeliveryTruck01Icon, title: "Fast Delivery", desc: "Hot food at your door in under 30 minutes" },
  { icon: SpoonIcon, title: "Quality Food", desc: "Partnered with the best local restaurants" },
  { icon: HeadsetIcon, title: "24/7 Support", desc: "Real-time order tracking and support" },
]

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
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-background p-8 md:p-12 mb-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--primary)_0%,transparent_60%)] opacity-10" />
        <div className="relative max-w-2xl">
          <Badge variant="secondary" className="mb-4">🔥 #1 Food Delivery</Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            Your favorite food,<br />
            <span className="text-primary">delivered fast</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg mb-6 max-w-md">
            Order from the best local restaurants with easy tracking, fast delivery, and unbeatable taste.
          </p>
          <div className="flex gap-3">
            <Link to="/register"><Button size="lg">Get Started</Button></Link>
            <Link to="#restaurants">
              <Button variant="outline" size="lg">Browse Menu</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {features.map((f) => (
          <div key={f.title} className="flex flex-col items-center text-center p-6 rounded-xl bg-muted/40 border border-border/50 hover:border-primary/30 transition-colors">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <HugeiconsIcon icon={f.icon} className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </section>

      <div id="restaurants" className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Restaurants near you</h2>
          <p className="text-sm text-muted-foreground mt-1">Discover the best food around you</p>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground">
          <HugeiconsIcon icon={Location01Icon} className="h-4 w-4" />
          <span>Your location</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <HugeiconsIcon icon={AiSearchIcon} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search restaurants or cuisines..."
            className="pl-9 h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-44 h-10">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-full sm:w-44 h-10">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Default</SelectItem>
            <SelectItem value="rating">Top Rated</SelectItem>
            <SelectItem value="deliveryTime">Fastest Delivery</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {restaurants.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <div className="text-5xl mb-4">🍽️</div>
          <p className="text-lg font-medium">No restaurants found</p>
          <p className="text-sm mb-4">Try adjusting your search or filters</p>
          {search && <Button variant="outline" onClick={() => setSearch("")}>Clear search</Button>}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((r) => (
          <Link key={r._id} to={`/restaurant/${r._id}`} className="group">
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full overflow-hidden border-border/60">
              <div className="h-48 bg-muted flex items-center justify-center overflow-hidden">
                {r.image ? (
                  <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-5xl">🍽️</span>
                    <span className="text-xs text-muted-foreground">No image</span>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-base group-hover:text-primary transition-colors">{r.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <HugeiconsIcon icon={Location01Icon} className="h-3 w-3" /> {r.city}
                    </p>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1 shrink-0">
                    <HugeiconsIcon icon={HonourStarIcon} className="h-3 w-3" /> {r.rating || "New"}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <HugeiconsIcon icon={Clock01Icon} className="h-3 w-3" /> {r.deliveryTime}
                  </span>
                  <Badge variant="outline" className="text-[0.625rem]">{r.category}</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
