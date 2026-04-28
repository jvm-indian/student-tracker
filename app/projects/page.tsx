import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/navigation/navbar'
import { StudentPortal } from '@/components/projects/student-portal'
import { GuidePortal } from '@/components/projects/guide-portal'
import { AdminPortal } from '@/components/projects/admin-portal'

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const role = profile?.role || 'student'

  return (
    <main className="min-h-screen bg-background">
      <Navbar user={user} />
      <div className="pt-20 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Projects Portal</h1>
          <p className="text-muted-foreground">
            Manage your project teams, submissions, and evaluations.
          </p>
        </div>

        {role === 'student' && <StudentPortal user={user} profile={profile} />}
        {(role === 'guide' || role === 'teacher') && <GuidePortal user={user} profile={profile} />}
        {role === 'admin' && <AdminPortal user={user} profile={profile} />}
      </div>
    </main>
  )
}
