'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Calendar, Tag } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface NewsCardProps {
  id: string
  title: string
  description: string | null
  imageUrl: string | null
  sourceUrl: string
  category: string | null
  publishedAt: string
  isFeatured?: boolean
}

export function NewsCard({
  title,
  description,
  imageUrl,
  sourceUrl,
  category,
  publishedAt,
  isFeatured,
}: NewsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative"
    >
      <Link href={sourceUrl} target="_blank" rel="noopener noreferrer">
        <div className={`relative overflow-hidden rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 ${isFeatured ? 'ring-2 ring-primary/30' : ''}`}>
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Tag className="w-12 h-12 text-primary/50" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            
            {/* Category Badge */}
            {category && (
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 text-xs font-medium bg-primary/90 text-primary-foreground rounded-full">
                  {category}
                </span>
              </div>
            )}

            {/* Featured Badge */}
            {isFeatured && (
              <div className="absolute top-3 right-3">
                <span className="px-3 py-1 text-xs font-medium bg-accent/90 text-accent-foreground rounded-full">
                  Featured
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="font-semibold text-lg text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {description}
              </p>
            )}
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDistanceToNow(new Date(publishedAt), { addSuffix: true })}</span>
              </div>
              <div className="flex items-center gap-1 text-primary group-hover:translate-x-1 transition-transform">
                <span>Read more</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Glow Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
