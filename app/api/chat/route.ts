import { streamText, tool } from 'ai'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createGoogleGenerativeAI } from '@ai-sdk/google'

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || '',
})

export async function POST(req: Request) {
  const { messages } = await req.json()
  
  // Format messages to ensure compatibility with streamText
  const formattedMessages = messages.map((m: any) => ({
    role: m.role,
    content: m.content || m.text || (m.parts ? m.parts.map((p: any) => p.text).join('') : ''),
  }))
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: `You are TechEd AI, an advanced research assistant for engineering students and educators. 
You help with:
- Explaining complex engineering concepts
- Summarizing research papers
- Answering technical questions
- Helping with task management and study planning
- Providing guidance on research methodologies
- Suggesting relevant resources and papers

Be helpful, accurate, and engaging. Use technical language when appropriate but explain concepts clearly.
When discussing research topics, cite relevant concepts and provide structured explanations.
${user ? `The current user is logged in with email: ${user.email}` : 'The user is not logged in.'}`,
    messages: formattedMessages,
    tools: {
      searchResearch: tool({
        description: 'Search for research articles on a specific topic',
        inputSchema: z.object({
          query: z.string().describe('The search query for research articles'),
          category: z.string().nullable().describe('Optional category filter'),
        }),
        execute: async ({ query, category }) => {
          // Search research articles from database
          let queryBuilder = supabase
            .from('research_articles')
            .select('title, abstract, authors, category')
            .textSearch('title', query.split(' ').join(' | '))
            .limit(5)
          
          if (category) {
            queryBuilder = queryBuilder.eq('category', category)
          }
          
          const { data } = await queryBuilder
          
          if (data && data.length > 0) {
            return { results: data, message: `Found ${data.length} relevant articles` }
          }
          return { results: [], message: 'No articles found matching your query' }
        },
      }),
      createTask: tool({
        description: 'Create a new task for the user',
        inputSchema: z.object({
          title: z.string().describe('Task title'),
          description: z.string().nullable().describe('Task description'),
          dueDate: z.string().nullable().describe('Due date in ISO format'),
          priority: z.enum(['low', 'medium', 'high']).describe('Task priority'),
        }),
        execute: async ({ title, description, dueDate, priority }) => {
          if (!user) {
            return { success: false, message: 'User must be logged in to create tasks' }
          }
          
          const { error } = await supabase.from('tasks').insert({
            user_id: user.id,
            title,
            description,
            due_date: dueDate,
            priority,
            status: 'pending',
          })
          
          if (error) {
            return { success: false, message: 'Failed to create task' }
          }
          return { success: true, message: `Task "${title}" created successfully` }
        },
      }),
      getTasks: tool({
        description: 'Get the user\'s current tasks',
        inputSchema: z.object({
          status: z.enum(['pending', 'in_progress', 'completed', 'all']).optional(),
        }),
        execute: async ({ status }) => {
          if (!user) {
            return { tasks: [], message: 'User must be logged in to view tasks' }
          }
          
          let queryBuilder = supabase
            .from('tasks')
            .select('*')
            .eq('user_id', user.id)
            .order('due_date', { ascending: true })
          
          if (status && status !== 'all') {
            queryBuilder = queryBuilder.eq('status', status)
          }
          
          const { data } = await queryBuilder.limit(10)
          
          return { tasks: data || [], message: `Found ${data?.length || 0} tasks` }
        },
      }),
    },
  })

  return result.toUIMessageStreamResponse()
}
