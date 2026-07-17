import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

export function NavLink({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) {
  const location = useLocation()
  const isActive = location.pathname === to || location.pathname.startsWith(to + "/")

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "px-3 py-2 rounded-md text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-accent"
      )}
    >
      {children}
    </Link>
  )
}
