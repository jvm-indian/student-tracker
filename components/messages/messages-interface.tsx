'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  MessageSquare, Send, Search, Plus, User, Loader2,
  Users, GraduationCap, BookOpen
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface Profile {
  id: string
  full_name: string | null
  email: string | null
  role: string | null
  avatar_url: string | null
}

interface Conversation {
  id: string
  participant_1: string
  participant_2: string
  last_message_at: string
  participant_1_profile: Profile
  participant_2_profile: Profile
}

interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  is_read: boolean
  created_at: string
}

interface MessagesInterfaceProps {
  currentUserId: string
  conversations: Conversation[]
  allUsers: Profile[]
}

export function MessagesInterface({ currentUserId, conversations: initialConversations, allUsers }: MessagesInterfaceProps) {
  const [conversations, setConversations] = useState(initialConversations)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [newChatOpen, setNewChatOpen] = useState(false)
  const [hasAutoStarted, setHasAutoStarted] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const searchParams = useSearchParams()
  const router = useRouter()
  const chatWith = searchParams.get('chatWith')

  // Get other participant in conversation
  const getOtherParticipant = (conv: Conversation): Profile => {
    return conv.participant_1 === currentUserId 
      ? conv.participant_2_profile 
      : conv.participant_1_profile
  }

  // Load messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) return

    const loadMessages = async () => {
      setIsLoading(true)
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', selectedConversation.id)
        .order('created_at', { ascending: true })

      setMessages(data || [])
      setIsLoading(false)

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', selectedConversation.id)
        .neq('sender_id', currentUserId)
    }

    loadMessages()

    // Subscribe to new messages
    const channel = supabase
      .channel(`messages:${selectedConversation.id}`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${selectedConversation.id}` },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedConversation, currentUserId, supabase])

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation || isSending) return

    setIsSending(true)
    
    const { error } = await supabase.from('messages').insert({
      conversation_id: selectedConversation.id,
      sender_id: currentUserId,
      content: newMessage.trim(),
    })

    if (!error) {
      setNewMessage('')
      // Update last message time
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', selectedConversation.id)
    }

    setIsSending(false)
  }

  const startNewConversation = async (userId: string) => {
    // Check if conversation already exists
    const existing = conversations.find(c => 
      (c.participant_1 === currentUserId && c.participant_2 === userId) ||
      (c.participant_2 === currentUserId && c.participant_1 === userId)
    )

    if (existing) {
      setSelectedConversation(existing)
      setNewChatOpen(false)
      return
    }

    // Create new conversation
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        participant_1: currentUserId,
        participant_2: userId,
      })
      .select(`
        *,
        participant_1_profile:profiles!participant_1(id, full_name, email, role, avatar_url),
        participant_2_profile:profiles!participant_2(id, full_name, email, role, avatar_url)
      `)
      .single()

    if (error) {
      console.error('Error creating conversation:', error)
      toast.error('Failed to create conversation')
      return
    }

    if (data) {
      setConversations(prev => [data, ...prev])
      setSelectedConversation(data)
    }

    setNewChatOpen(false)
  }

  // Auto-start conversation if chatWith param is present
  useEffect(() => {
    if (chatWith && !hasAutoStarted) {
      setHasAutoStarted(true)
      startNewConversation(chatWith)
    }
  }, [chatWith, hasAutoStarted])

  const getRoleIcon = (role: string | null) => {
    switch (role) {
      case 'teacher': return <GraduationCap className="w-3 h-3" />
      case 'guide': return <BookOpen className="w-3 h-3" />
      default: return <User className="w-3 h-3" />
    }
  }

  const filteredUsers = allUsers.filter(user => 
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-full">
      {/* Conversations Sidebar */}
      <div className="w-80 border-r border-border bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Messages</h2>
            <Dialog open={newChatOpen} onOpenChange={setNewChatOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  New
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Start New Conversation</DialogTitle>
                  <DialogDescription>Select a user to start chatting</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <ScrollArea className="h-64">
                    <div className="space-y-2">
                      {filteredUsers.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => startNewConversation(user.id)}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                        >
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={user.avatar_url || undefined} />
                            <AvatarFallback>
                              {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {user.full_name || user.email}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              {getRoleIcon(user.role)}
                              <span className="capitalize">{user.role || 'Student'}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {conversations.length > 0 ? (
              conversations.map((conv) => {
                const other = getOtherParticipant(conv)
                const isSelected = selectedConversation?.id === conv.id
                
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left mb-1',
                      isSelected ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted'
                    )}
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={other.avatar_url || undefined} />
                      <AvatarFallback>
                        {other.full_name?.charAt(0) || other.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {other.full_name || other.email}
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn(
                          'text-xs flex items-center gap-1',
                          isSelected ? 'text-primary' : 'text-muted-foreground'
                        )}>
                          {getRoleIcon(other.role)}
                          <span className="capitalize">{other.role || 'Student'}</span>
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: false })}
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No conversations yet</p>
                <p className="text-sm">Start a new chat</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b border-border bg-card/50 flex items-center px-4 gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={getOtherParticipant(selectedConversation).avatar_url || undefined} />
                <AvatarFallback>
                  {getOtherParticipant(selectedConversation).full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">
                  {getOtherParticipant(selectedConversation).full_name || getOtherParticipant(selectedConversation).email}
                </p>
                <p className="text-xs text-muted-foreground capitalize flex items-center gap-1">
                  {getRoleIcon(getOtherParticipant(selectedConversation).role)}
                  {getOtherParticipant(selectedConversation).role || 'Student'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea ref={scrollRef} className="flex-1 p-4">
              <div className="max-w-3xl mx-auto space-y-4">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : messages.length > 0 ? (
                  <AnimatePresence>
                    {messages.map((message) => {
                      const isOwn = message.sender_id === currentUserId
                      return (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}
                        >
                          <div
                            className={cn(
                              'max-w-[70%] rounded-2xl px-4 py-2',
                              isOwn
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-foreground'
                            )}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={cn(
                              'text-xs mt-1',
                              isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                            )}>
                              {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No messages yet</p>
                    <p className="text-sm">Send the first message</p>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="border-t border-border p-4 bg-card/50">
              <form onSubmit={handleSendMessage} className="flex gap-3 max-w-3xl mx-auto">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-background border-border"
                />
                <Button type="submit" disabled={!newMessage.trim() || isSending}>
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            <div className="text-center text-muted-foreground">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground mb-2">Select a conversation</h3>
              <p className="text-sm mb-6">Choose a conversation from the sidebar or start a new one</p>
              
              {chatWith && (
                <Button 
                  onClick={() => startNewConversation(chatWith)}
                  className="bg-primary hover:bg-primary/90 mt-4"
                >
                  Start Chat with Selected User
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
