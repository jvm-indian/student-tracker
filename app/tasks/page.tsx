import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/navigation/navbar'
import { TasksInterface } from '@/components/tasks/tasks-interface'

export default async function TasksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch user's tasks
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-background">
      <Navbar user={user} />
      <div className="pt-24 pb-12">
        <TasksInterface userId={user.id} initialTasks={tasks || []} />
      </div>
    </main>
  )
}
