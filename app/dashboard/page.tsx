import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/navigation/navbar'
import { DashboardContent } from '@/components/dashboard/dashboard-content'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch user profile
  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fix: synchronize role if missing or different from metadata
  const metadataRole = user?.user_metadata?.role
  if (metadataRole && (!profile || profile.role !== metadataRole)) {
    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update({ role: metadataRole })
      .eq('id', user.id)
      .select()
      .single()
    
    if (!error && updatedProfile) {
      profile = updatedProfile
    }
  }

  // Fetch user tasks
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('due_date', { ascending: true })
    .limit(5)

  // Fetch announcements
  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3)

  // Fetch recent messages count
  const { count: unreadMessages } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false)

  return (
    <main className="min-h-screen bg-background">
      <Navbar user={user} />
      <div className="pt-20 pb-12">
        <DashboardContent
          user={user}
          profile={profile}
          tasks={tasks || []}
          announcements={announcements || []}
          unreadMessages={unreadMessages || 0}
        />
      </div>
    </main>
  )
}
