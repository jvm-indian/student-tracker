import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/navigation/navbar'
import { MessagesInterface } from '@/components/messages/messages-interface'

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch user's conversations
  const { data: conversations } = await supabase
    .from('conversations')
    .select(`
      *,
      participant_1_profile:profiles!participant_1(id, full_name, email, role, avatar_url),
      participant_2_profile:profiles!participant_2(id, full_name, email, role, avatar_url)
    `)
    .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
    .order('last_message_at', { ascending: false })

  // Fetch all users for new conversation (excluding current user)
  const { data: allUsers } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, avatar_url')
    .neq('id', user.id)
    .limit(50)

  return (
    <main className="min-h-screen bg-background">
      <Navbar user={user} />
      <div className="pt-16 h-screen">
        <MessagesInterface 
          currentUserId={user.id}
          conversations={conversations || []}
          allUsers={allUsers || []}
        />
      </div>
    </main>
  )
}
