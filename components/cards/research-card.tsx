'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, Users, Eye, Download, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ResearchCardProps {
  id: string
  title: string
  abstract: string | null
  authors: string[] | null
  keywords: string[] | null
  category: string | null
  imageUrl: string | null
  viewCount: number
  downloadCount: number
}

export function ResearchCard({
  id,
  title,
  abstract,
  authors,
  keywords,
  category,
  imageUrl,
  viewCount,
  downloadCount,
}: ResearchCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="relative w-full md:w-64 h-48 md:h-auto shrink-0 overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-primary/50" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/80 hidden md:block" />
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {/* Category */}
            {category && (
              <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-3">
                {category}
              </span>
            )}

            <h3 className="font-semibold text-xl text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>

            {/* Authors */}
            {authors && authors.length > 0 && (
              <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span className="line-clamp-1">{authors.join(', ')}</span>
              </div>
            )}

            {/* Abstract */}
            {abstract && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {abstract}
              </p>
            )}

            {/* Keywords */}
            {keywords && keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {keywords.slice(0, 4).map((keyword, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-md"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}

            {/* Stats & Action */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{viewCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  <span>{downloadCount}</span>
                </div>
              </div>
              <Link href={`/research/${id}`}>
                <Button size="sm" variant="ghost" className="gap-2 group-hover:text-primary">
                  Read Paper
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
