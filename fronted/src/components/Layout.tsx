import { Link, Outlet } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { NavLink } from "@/components/NavLink"
import { HugeiconsIcon } from "@hugeicons/react"
import { Menu01Icon, ShoppingCart01Icon, MenuRestaurantIcon } from "@hugeicons/core-free-icons"
import { useState } from "react"

export default function Layout() {
  const { user, role, logout } = useAuth()
  const [open, setOpen] = useState(false)

  const closeSheet = () => setOpen(false)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <HugeiconsIcon icon={MenuRestaurantIcon} className="h-6 w-6" />
            <span className="hidden sm:inline">FoodieHub</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/">Home</NavLink>
            {role === "partner" && (
              <>
                <NavLink to="/partner/orders">Orders</NavLink>
                <NavLink to="/partner/foods">Menu</NavLink>
                <NavLink to="/partner/restaurant">Restaurant</NavLink>
              </>
            )}
            {role === "user" && (
              <>
                <NavLink to="/cart">
                  <span className="flex items-center gap-1">
                    <HugeiconsIcon icon={ShoppingCart01Icon} className="h-4 w-4" /> Cart
                  </span>
                </NavLink>
                <NavLink to="/orders">My Orders</NavLink>
              </>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <Button variant="outline" onClick={logout}>Logout</Button>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
                <Link to="/register"><Button size="sm">Sign Up</Button></Link>
              </>
            )}
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon"><HugeiconsIcon icon={Menu01Icon} /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 mt-8">
                <NavLink to="/" onClick={closeSheet}>Home</NavLink>
                {role === "partner" && (
                  <>
                    <NavLink to="/partner/orders" onClick={closeSheet}>Orders</NavLink>
                    <NavLink to="/partner/foods" onClick={closeSheet}>Menu</NavLink>
                    <NavLink to="/partner/restaurant" onClick={closeSheet}>Restaurant</NavLink>
                  </>
                )}
                {role === "user" && (
                  <>
                    <NavLink to="/cart" onClick={closeSheet}>Cart</NavLink>
                    <NavLink to="/orders" onClick={closeSheet}>My Orders</NavLink>
                  </>
                )}
                <div className="border-t pt-4">
                  {user ? (
                    <Button variant="outline" className="w-full" onClick={() => { logout(); closeSheet() }}>Logout</Button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link to="/login" onClick={closeSheet}><Button variant="outline" className="w-full">Login</Button></Link>
                      <Link to="/register" onClick={closeSheet}><Button className="w-full">Sign Up</Button></Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
