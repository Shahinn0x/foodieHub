import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [userData, setUserData] = useState({ fullName: "", email: "", password: "" })
  const [partnerData, setPartnerData] = useState({
    name: "", contactName: "", phone: "", address: "", email: "", password: ""
  })

  async function handleUserRegister() {
    setLoading(true)
    try {
      await register(userData, "user")
      toast.success("Registered successfully")
      navigate("/")
    } catch {
      toast.error("Registration failed")
    } finally {
      setLoading(false)
    }
  }

  async function handlePartnerRegister() {
    setLoading(true)
    try {
      await register(partnerData, "partner")
      toast.success("Registered successfully")
      navigate("/partner/orders")
    } catch {
      toast.error("Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Join FoodieHub today</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="user">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="user" className="flex-1">User</TabsTrigger>
              <TabsTrigger value="partner" className="flex-1">Food Partner</TabsTrigger>
            </TabsList>

            <TabsContent value="user" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={userData.fullName} onChange={(e) => setUserData({ ...userData, fullName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <Input id="reg-email" type="email" value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Password</Label>
                <Input id="reg-password" type="password" value={userData.password} onChange={(e) => setUserData({ ...userData, password: e.target.value })} />
              </div>
              <Button className="w-full" disabled={loading} onClick={handleUserRegister}>
                {loading ? "Creating..." : "Register as User"}
              </Button>
            </TabsContent>

            <TabsContent value="partner" className="space-y-4">
              <div className="space-y-2">
                <Label>Restaurant Name</Label>
                <Input value={partnerData.name} onChange={(e) => setPartnerData({ ...partnerData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Contact Name</Label>
                <Input value={partnerData.contactName} onChange={(e) => setPartnerData({ ...partnerData, contactName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={partnerData.phone} onChange={(e) => setPartnerData({ ...partnerData, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input value={partnerData.address} onChange={(e) => setPartnerData({ ...partnerData, address: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={partnerData.email} onChange={(e) => setPartnerData({ ...partnerData, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" value={partnerData.password} onChange={(e) => setPartnerData({ ...partnerData, password: e.target.value })} />
              </div>
              <Button className="w-full" disabled={loading} onClick={handlePartnerRegister}>
                {loading ? "Creating..." : "Register as Food Partner"}
              </Button>
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
