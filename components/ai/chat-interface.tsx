'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bot, User, Send, Loader2, Sparkles, BookOpen, ListTodo, Search, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const suggestedPrompts = [
  { icon: BookOpen, text: 'Explain quantum computing basics' },
  { icon: Search, text: 'Find research on machine learning' },
  { icon: ListTodo, text: 'Help me plan my study schedule' },
  { icon: Sparkles, text: 'Summarize recent AI breakthroughs' },
]

export function AIChatInterface() {
  const [inputValue, setInputValue] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return
    
    sendMessage({ text: inputValue })
    setInputValue('')
  }

  const handleSuggestedPrompt = (prompt: string) => {
    sendMessage({ text: prompt })
  }

  const clearChat = () => {
    setMessages([])
  }

  // Helper to extract text from message parts
  const getMessageText = (message: typeof messages[0]) => {
    if (!message.parts || !Array.isArray(message.parts)) return ''
    return message.parts
      .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
      .map((p) => p.text)
      .join('')
  }

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="hidden lg:flex w-72 flex-col border-r border-border bg-card/50 p-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">TechEd AI</h2>
            <p className="text-xs text-muted-foreground">Research Assistant</p>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Capabilities</p>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
              <BookOpen className="w-4 h-4 text-primary" />
              <span>Research assistance</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
              <Search className="w-4 h-4 text-primary" />
              <span>Paper search</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
              <ListTodo className="w-4 h-4 text-primary" />
              <span>Task management</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Concept explanation</span>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full gap-2"
            onClick={clearChat}
          >
            <Trash2 className="w-4 h-4" />
            Clear Chat
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <ScrollArea ref={scrollRef} className="flex-1 p-4">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6">
                  <Bot className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">TechEd AI Assistant</h2>
                <p className="text-muted-foreground mb-8 max-w-md">
                  Your intelligent research companion. Ask questions, search papers, or get help with your studies.
                </p>
                
                {/* Suggested Prompts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                  {suggestedPrompts.map((prompt, index) => {
                    const Icon = prompt.icon
                    return (
                      <button
                        key={index}
                        onClick={() => handleSuggestedPrompt(prompt.text)}
                        className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-muted/50 transition-all text-left"
                      >
                        <Icon className="w-5 h-5 text-primary shrink-0" />
                        <span className="text-sm text-foreground">{prompt.text}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      'flex gap-4',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={cn(
                        'max-w-[80%] rounded-2xl px-4 py-3',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card border border-border'
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">{getMessageText(message)}</p>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-card border border-border rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-border p-4 bg-card/50">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="flex gap-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask anything about engineering, research, or your studies..."
                className="flex-1 bg-background border-border"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                disabled={!inputValue.trim() || isLoading}
                className="bg-primary hover:bg-primary/90 gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Send</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              TechEd AI can make mistakes. Verify important information.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
