'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Bot, MessageSquare, BookOpen, ListTodo, Bell, 
  Calendar, CheckCircle2, Clock, Plus, ArrowRight,
  Newspaper, Users, TrendingUp
} from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import { formatDistanceToNow } from 'date-fns'

import { StudentPortal } from '@/components/projects/student-portal'
import { GuidePortal } from '@/components/projects/guide-portal'
import { AdminPortal } from '@/components/projects/admin-portal'

interface DashboardContentProps {
  user: User
  profile: {
    full_name: string | null
    role: string | null
    department: string | null
  } | null
  tasks: Array<{
    id: string
    title: string
    description: string | null
    due_date: string | null
    priority: string
    status: string
  }>
  announcements: Array<{
    id: string
    title: string
    content: string
    created_at: string
    is_pinned: boolean
  }>
  unreadMessages: number
}

const quickActions = [
  { icon: Bot, label: 'AI Assistant', href: '/ai-assistant', color: 'from-blue-500 to-cyan-500' },
  { icon: MessageSquare, label: 'Messages', href: '/messages', color: 'from-teal-500 to-emerald-500' },
  { icon: BookOpen, label: 'Research', href: '/research', color: 'from-purple-500 to-pink-500' },
  { icon: Newspaper, label: 'Tech News', href: '/news', color: 'from-orange-500 to-red-500' },
]

export function DashboardContent({ user, profile, tasks, announcements, unreadMessages }: DashboardContentProps) {
  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress')
  const completedTasks = tasks.filter(t => t.status === 'completed')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {greeting()}, {profile?.full_name || user.email?.split('@')[0]}
        </h1>
        <p className="text-muted-foreground">
          {profile?.role === 'teacher' ? 'Teacher Dashboard' : 
           profile?.role === 'guide' ? 'Research Guide Dashboard' : 
           'Student Dashboard'} | Here&apos;s your research overview
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Tasks</p>
                <p className="text-3xl font-bold text-foreground">{pendingTasks.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-foreground">{completedTasks.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unread Messages</p>
                <p className="text-3xl font-bold text-foreground">{unreadMessages}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Research Progress</p>
                <p className="text-3xl font-bold text-foreground">65%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Link key={action.label} href={action.href}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="group p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-medium text-foreground">{action.label}</p>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </motion.div>

      {/* Role-Specific Features (Project Portals) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-8"
      >
        <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
          {profile?.role === 'admin' ? 'Administration & Approvals Hub' : 
           (profile?.role === 'guide' || profile?.role === 'teacher') ? 'Guide Evaluation Portal' : 
           'Your Project Workspace'}
        </h2>
        <div className="mt-4">
          {(!profile?.role || profile.role === 'student') && <StudentPortal user={user} profile={profile} />}
          {(profile?.role === 'guide' || profile?.role === 'teacher') && <GuidePortal user={user} profile={profile} />}
          {profile?.role === 'admin' && <AdminPortal user={user} profile={profile} />}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ListTodo className="w-5 h-5 text-primary" />
                  Your Tasks
                </CardTitle>
                <CardDescription>Manage your research tasks and deadlines</CardDescription>
              </div>
              <Link href="/tasks">
                <Button size="sm" variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Task
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {pendingTasks.length > 0 ? (
                <div className="space-y-3">
                  {pendingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          task.priority === 'high' ? 'bg-red-500' :
                          task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <div>
                          <p className="font-medium text-foreground">{task.title}</p>
                          {task.due_date && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Due {formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        task.status === 'in_progress' ? 'bg-blue-500/10 text-blue-500' : 'bg-muted text-muted-foreground'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ListTodo className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No pending tasks</p>
                  <p className="text-sm">Create a task to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Announcements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Announcements
              </CardTitle>
              <CardDescription>Latest updates and news</CardDescription>
            </CardHeader>
            <CardContent>
              {announcements.length > 0 ? (
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="p-3 rounded-lg bg-muted/50 border border-border"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-medium text-foreground text-sm">{announcement.title}</h4>
                        {announcement.is_pinned && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">Pinned</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{announcement.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDistanceToNow(new Date(announcement.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No announcements</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
