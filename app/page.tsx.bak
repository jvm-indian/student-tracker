import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/navigation/navbar'
import { Footer } from '@/components/navigation/footer'
import { HeroSection } from '@/components/sections/hero-section'
import { FeaturesSection } from '@/components/sections/features-section'
import { NewsSection } from '@/components/sections/news-section'

// Mock data for initial display (will be replaced with real data from Supabase)
const mockNews = [
  {
    id: '1',
    title: 'Quantum Computing Breakthrough: IBM Unveils 1000-Qubit Processor',
    description: 'IBM has announced a major milestone in quantum computing with their new 1000-qubit processor.',
    image_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
    source_url: 'https://techcrunch.com',
    category: 'Quantum Computing',
    published_at: new Date().toISOString(),
    is_featured: true,
  },
  {
    id: '2',
    title: 'SpaceX Successfully Tests Starship Lunar Landing System',
    description: 'SpaceX completed critical testing of the Starship lunar landing system.',
    image_url: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=800',
    source_url: 'https://space.com',
    category: 'Space Technology',
    published_at: new Date().toISOString(),
    is_featured: true,
  },
  {
    id: '3',
    title: 'AI Revolutionizes Drug Discovery: New Cancer Treatment Found',
    description: 'Artificial intelligence has accelerated the discovery of a promising new cancer treatment.',
    image_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
    source_url: 'https://nature.com',
    category: 'AI & Healthcare',
    published_at: new Date().toISOString(),
    is_featured: true,
  },
  {
    id: '4',
    title: 'Next-Gen Solar Panels Achieve 47% Efficiency Record',
    description: 'Researchers have developed solar cells with unprecedented 47% efficiency.',
    image_url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
    source_url: 'https://sciencedaily.com',
    category: 'Renewable Energy',
    published_at: new Date().toISOString(),
    is_featured: false,
  },
]

export default async function HomePage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // Try to fetch news from database, fallback to mock data
  const { data: newsData } = await supabase
    .from('tech_news')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(8)

  const news = newsData && newsData.length > 0 ? newsData : mockNews

  return (
    <main className="min-h-screen bg-background">
      <Navbar user={user} />
      <HeroSection />
      <FeaturesSection />
      <NewsSection news={news} />
      <Footer />
    </main>
  )
}
