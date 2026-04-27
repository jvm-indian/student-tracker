"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/navigation/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Mail, Building, Calendar, FileText, Save, LogOut } from "lucide-react"

interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: string
  department: string | null
  enrollment_year: number | null
  bio: string | null
}

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    department: "",
    enrollment_year: "",
    bio: ""
  })

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profileData) {
        setProfile(profileData)
        setFormData({
          full_name: profileData.full_name || "",
          department: profileData.department || "",
          enrollment_year: profileData.enrollment_year?.toString() || "",
          bio: profileData.bio || ""
        })
      }
      setLoading(false)
    }

    loadProfile()
  }, [router, supabase])

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: formData.full_name,
        department: formData.department,
        enrollment_year: formData.enrollment_year ? parseInt(formData.enrollment_year) : null,
        bio: formData.bio,
        updated_at: new Date().toISOString()
      })
      .eq("id", profile.id)

    if (!error) {
      setProfile({ ...profile, ...formData, enrollment_year: formData.enrollment_year ? parseInt(formData.enrollment_year) : null })
    }
    setSaving(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-card/50 backdrop-blur-xl border-border/50">
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4 ring-2 ring-primary/20">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{profile?.full_name || "Your Profile"}</CardTitle>
              <CardDescription className="flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                {profile?.email}
              </CardDescription>
              <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-primary/10 rounded-full text-primary text-sm capitalize">
                <User className="w-4 h-4" />
                {profile?.role}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Enter your full name"
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Department
                </Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="computer-science">Computer Science</SelectItem>
                    <SelectItem value="electrical-engineering">Electrical Engineering</SelectItem>
                    <SelectItem value="mechanical-engineering">Mechanical Engineering</SelectItem>
                    <SelectItem value="civil-engineering">Civil Engineering</SelectItem>
                    <SelectItem value="chemical-engineering">Chemical Engineering</SelectItem>
                    <SelectItem value="aerospace-engineering">Aerospace Engineering</SelectItem>
                    <SelectItem value="biomedical-engineering">Biomedical Engineering</SelectItem>
                    <SelectItem value="materials-science">Materials Science</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="enrollment_year" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Enrollment Year
                </Label>
                <Input
                  id="enrollment_year"
                  type="number"
                  value={formData.enrollment_year}
                  onChange={(e) => setFormData({ ...formData, enrollment_year: e.target.value })}
                  placeholder="e.g., 2023"
                  min="2000"
                  max="2030"
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself, your research interests, and goals..."
                  rows={4}
                  className="bg-background/50 resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="border-destructive/50 text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
