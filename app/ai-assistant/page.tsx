import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/navigation/navbar'
import { AIChatInterface } from '@/components/ai/chat-interface'

export default async function AIAssistantPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar user={user} />
      <div className="pt-16 h-screen">
        <AIChatInterface />
      </div>
    </main>
  )
}
