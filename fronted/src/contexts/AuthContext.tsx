import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import api from "@/lib/api"
import type { User, FoodPartner } from "@/types"

type AuthUser = User | FoodPartner
type Role = "user" | "partner" | "admin" | null

interface AuthContextType {
  user: AuthUser | null
  role: Role
  loading: boolean
  login: (email: string, password: string, role: "user" | "partner") => Promise<void>
  register: (data: Record<string, string>, role: "user" | "partner") => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [role, setRole] = useState<Role>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  async function login(email: string, password: string, roleType: "user" | "partner") {
    const path = roleType === "user" ? "/auth/user/login" : "/auth/food-partner/login"
    const res = await api.post(path, { email, password })

    if (roleType === "user") {
      setUser(res.data.user)
      setRole("user")
    } else {
      setUser(res.data.foodPartner)
      setRole("partner")
    }
  }

  async function register(data: Record<string, string>, roleType: "user" | "partner") {
    const path = roleType === "user" ? "/auth/user/register" : "/auth/food-partner/register"
    const res = await api.post(path, data)

    if (roleType === "user") {
      setUser(res.data.user)
      setRole("user")
    } else {
      setUser(res.data.foodPartner)
      setRole("partner")
    }
  }

  async function logout() {
    const path = role === "user" ? "/auth/user/logout" : "/auth/food-partner/logout"
    await api.get(path)
    setUser(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
