'use client'

import { motion } from 'framer-motion'
import { Bot, BookOpen, MessageSquare, Calendar, Search, Zap, Users, Shield } from 'lucide-react'

const features = [
  {
    icon: Bot,
    title: 'AI Research Assistant',
    description: 'Get instant answers to complex engineering questions, summarize papers, and automate repetitive tasks with our advanced AI.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: MessageSquare,
    title: 'Guide-Student Chat',
    description: 'Connect directly with your assigned research guide through real-time messaging for personalized mentorship.',
    color: 'from-teal-500 to-emerald-500',
  },
  {
    icon: BookOpen,
    title: 'Research Library',
    description: 'Access thousands of peer-reviewed research papers, journals, and technical documentation in one place.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Calendar,
    title: 'Smart Task Management',
    description: 'Organize your research timeline, set deadlines, and track progress with AI-powered task suggestions.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Search,
    title: 'Intelligent Search',
    description: 'Find relevant research papers and resources using semantic search powered by advanced NLP algorithms.',
    color: 'from-blue-500 to-purple-500',
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    description: 'Stay updated with the latest tech news and breakthroughs in your field of interest.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Users,
    title: 'Collaborative Workspace',
    description: 'Work together with peers on research projects with shared documents and discussion boards.',
    color: 'from-green-500 to-teal-500',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your research data is protected with enterprise-grade security and encryption standards.',
    color: 'from-gray-500 to-slate-500',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Platform Features
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Everything You Need to Excel
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful tools designed to accelerate your research and learning journey
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300"
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>

                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-5`} />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
