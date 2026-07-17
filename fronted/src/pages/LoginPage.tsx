import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(role: "user" | "partner") {
    setLoading(true)
    try {
      await login(email, password, role)
      toast.success("Logged in successfully")
      navigate(role === "partner" ? "/partner/orders" : "/")
    } catch {
      toast.error("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Login to your FoodieHub account</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="user">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="user" className="flex-1">User</TabsTrigger>
              <TabsTrigger value="partner" className="flex-1">Food Partner</TabsTrigger>
            </TabsList>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              <TabsContent value="user" className="mt-0">
                <Button className="w-full" disabled={loading} onClick={() => handleSubmit("user")}>
                  {loading ? "Logging in..." : "Login as User"}
                </Button>
              </TabsContent>
              <TabsContent value="partner" className="mt-0">
                <Button className="w-full" disabled={loading} onClick={() => handleSubmit("partner")}>
                  {loading ? "Logging in..." : "Login as Partner"}
                </Button>
              </TabsContent>
            </div>
          </Tabs>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Don't have an account? <Link to="/register" className="text-primary hover:underline">Register</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
