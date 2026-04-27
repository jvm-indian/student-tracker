'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Newspaper } from 'lucide-react'
import { NewsCard } from '@/components/cards/news-card'

interface NewsItem {
  id: string
  title: string
  description: string | null
  image_url: string | null
  source_url: string
  category: string | null
  published_at: string
  is_featured: boolean
}

interface NewsSectionProps {
  news: NewsItem[]
}

export function NewsSection({ news }: NewsSectionProps) {
  const displayNews = news.slice(0, 4)

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Newspaper className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Latest Updates</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Tech News Flash
            </h2>
            <p className="text-muted-foreground mt-2">
              Stay updated with the latest breakthroughs in technology and engineering
            </p>
          </div>
          <Link href="/news">
            <Button variant="outline" className="gap-2">
              View All News
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

        {/* News Grid */}
        {displayNews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayNews.map((item) => (
              <NewsCard
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                imageUrl={item.image_url}
                sourceUrl={item.source_url}
                category={item.category}
                publishedAt={item.published_at}
                isFeatured={item.is_featured}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No news articles available yet.</p>
          </div>
        )}
      </div>
    </section>
  )
}
