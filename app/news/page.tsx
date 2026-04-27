import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/navigation/navbar'
import { Footer } from '@/components/navigation/footer'
import { NewsCard } from '@/components/cards/news-card'
import { Newspaper, Search, Filter } from 'lucide-react'
import { NewsFilters } from '@/components/news/news-filters'

// Mock data for initial display
const mockNews = [
  {
    id: '1',
    title: 'Quantum Computing Breakthrough: IBM Unveils 1000-Qubit Processor',
    description: 'IBM has announced a major milestone in quantum computing with their new 1000-qubit processor, bringing practical quantum computing closer to reality.',
    image_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
    source_url: 'https://techcrunch.com',
    category: 'Quantum Computing',
    published_at: new Date().toISOString(),
    is_featured: true,
  },
  {
    id: '2',
    title: 'SpaceX Successfully Tests Starship Lunar Landing System',
    description: 'SpaceX completed critical testing of the Starship lunar landing system, advancing NASA Artemis mission preparations.',
    image_url: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=800',
    source_url: 'https://space.com',
    category: 'Space Technology',
    published_at: new Date().toISOString(),
    is_featured: true,
  },
  {
    id: '3',
    title: 'AI Revolutionizes Drug Discovery: New Cancer Treatment Found',
    description: 'Artificial intelligence has accelerated the discovery of a promising new cancer treatment, reducing research time from years to months.',
    image_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
    source_url: 'https://nature.com',
    category: 'AI & Healthcare',
    published_at: new Date().toISOString(),
    is_featured: true,
  },
  {
    id: '4',
    title: 'Next-Gen Solar Panels Achieve 47% Efficiency Record',
    description: 'Researchers have developed solar cells with unprecedented 47% efficiency using perovskite-silicon tandem technology.',
    image_url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
    source_url: 'https://sciencedaily.com',
    category: 'Renewable Energy',
    published_at: new Date().toISOString(),
    is_featured: false,
  },
  {
    id: '5',
    title: 'Neural Interface Enables Paralyzed Patient to Walk Again',
    description: 'A revolutionary brain-spine interface has restored mobility to a paralyzed patient, marking a historic advancement in neurotechnology.',
    image_url: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800',
    source_url: 'https://wired.com',
    category: 'Neurotechnology',
    published_at: new Date().toISOString(),
    is_featured: true,
  },
  {
    id: '6',
    title: 'Breakthrough in Fusion Energy: Net Positive Achieved',
    description: 'Scientists have achieved sustained net-positive energy output in fusion reactions, bringing clean unlimited energy closer to reality.',
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    source_url: 'https://newscientist.com',
    category: 'Energy',
    published_at: new Date().toISOString(),
    is_featured: false,
  },
  {
    id: '7',
    title: 'Revolutionary Biodegradable Electronics Developed',
    description: 'Engineers have created fully biodegradable electronic circuits that dissolve harmlessly in the environment after use.',
    image_url: 'https://images.unsplash.com/photo-1581092921461-7031e8fbc20c?w=800',
    source_url: 'https://ieee.org',
    category: 'Sustainability',
    published_at: new Date().toISOString(),
    is_featured: false,
  },
  {
    id: '8',
    title: '5G Network Achieves 10 Gbps Speed in Real-World Tests',
    description: 'Telecommunications companies demonstrate practical 10 Gbps 5G speeds, enabling new applications in autonomous vehicles and AR.',
    image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    source_url: 'https://zdnet.com',
    category: 'Telecommunications',
    published_at: new Date().toISOString(),
    is_featured: false,
  },
]

export default async function NewsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: newsData } = await supabase
    .from('tech_news')
    .select('*')
    .order('published_at', { ascending: false })

  const news = newsData && newsData.length > 0 ? newsData : mockNews

  // Get unique categories
  const categories = [...new Set(news.map((item) => item.category).filter(Boolean))]

  return (
    <main className="min-h-screen bg-background">
      <Navbar user={user} />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Newspaper className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium text-primary uppercase tracking-wider">Latest Updates</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Tech News Flash
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Stay informed with the latest breakthroughs and developments in technology, 
              engineering, and science from around the world.
            </p>
          </div>

          {/* Filters */}
          <NewsFilters categories={categories as string[]} />

          {/* News Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {news.map((item) => (
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
        </div>
      </div>

      <Footer />
    </main>
  )
}
