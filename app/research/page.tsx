import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/navigation/navbar'
import { Footer } from '@/components/navigation/footer'
import { ResearchCard } from '@/components/cards/research-card'
import { BookOpen } from 'lucide-react'
import { ResearchFilters } from '@/components/research/research-filters'

// Mock data for initial display
const mockResearch = [
  {
    id: '1',
    title: 'Deep Learning Approaches for Autonomous Vehicle Navigation',
    abstract: 'This paper presents a comprehensive review of deep learning techniques applied to autonomous vehicle navigation systems, including perception, decision-making, and control modules.',
    authors: ['Dr. Sarah Chen', 'Prof. Michael Roberts', 'Dr. Raj Patel'],
    keywords: ['deep learning', 'autonomous vehicles', 'computer vision', 'reinforcement learning'],
    category: 'Artificial Intelligence',
    image_url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800',
    view_count: 1250,
    download_count: 342,
  },
  {
    id: '2',
    title: 'Sustainable Materials for Next-Generation Aerospace Applications',
    abstract: 'A study on advanced composite materials with reduced environmental impact for use in aerospace structures, focusing on bio-based polymers and recyclable carbon fiber systems.',
    authors: ['Dr. Emma Williams', 'Dr. James Liu', 'Prof. Maria Garcia'],
    keywords: ['aerospace', 'sustainable materials', 'composites', 'bio-polymers'],
    category: 'Materials Science',
    image_url: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=800',
    view_count: 890,
    download_count: 215,
  },
  {
    id: '3',
    title: 'Quantum Machine Learning: A Survey of Algorithms and Applications',
    abstract: 'This survey covers the intersection of quantum computing and machine learning, examining quantum-enhanced algorithms and their potential applications in various domains.',
    authors: ['Prof. David Kim', 'Dr. Lisa Wang', 'Dr. Alex Thompson'],
    keywords: ['quantum computing', 'machine learning', 'quantum algorithms', 'optimization'],
    category: 'Quantum Computing',
    image_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
    view_count: 2100,
    download_count: 567,
  },
  {
    id: '4',
    title: 'Advances in CRISPR Gene Editing for Therapeutic Applications',
    abstract: 'A review of recent developments in CRISPR-Cas9 technology for treating genetic disorders, including delivery methods, off-target effects, and clinical trial results.',
    authors: ['Dr. Jennifer Brown', 'Prof. Robert Taylor', 'Dr. Amanda Wilson'],
    keywords: ['CRISPR', 'gene editing', 'therapeutic applications', 'genetic disorders'],
    category: 'Biotechnology',
    image_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
    view_count: 1680,
    download_count: 423,
  },
  {
    id: '5',
    title: 'Neuromorphic Computing: Brain-Inspired Hardware for AI',
    abstract: 'This paper explores neuromorphic computing architectures that mimic biological neural networks, offering energy-efficient alternatives to traditional computing for AI applications.',
    authors: ['Dr. Kevin Zhang', 'Prof. Susan Miller', 'Dr. Chris Anderson'],
    keywords: ['neuromorphic computing', 'artificial intelligence', 'spiking neural networks', 'energy efficiency'],
    category: 'Computer Architecture',
    image_url: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800',
    view_count: 945,
    download_count: 287,
  },
  {
    id: '6',
    title: 'Renewable Energy Integration in Smart Grid Systems',
    abstract: 'A comprehensive study on integrating large-scale renewable energy sources into smart grid infrastructure, addressing challenges in stability, storage, and demand response.',
    authors: ['Dr. Patricia Lee', 'Prof. Mark Johnson', 'Dr. Daniel Brown'],
    keywords: ['smart grid', 'renewable energy', 'energy storage', 'grid stability'],
    category: 'Energy Systems',
    image_url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
    view_count: 1120,
    download_count: 356,
  },
]

export default async function ResearchPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: researchData } = await supabase
    .from('research_articles')
    .select('*')
    .order('published_at', { ascending: false })

  const research = researchData && researchData.length > 0 ? researchData : mockResearch

  // Get unique categories
  const categories = [...new Set(research.map((item) => item.category).filter(Boolean))]

  return (
    <main className="min-h-screen bg-background">
      <Navbar user={user} />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium text-primary uppercase tracking-wider">Research Library</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Research Articles
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Access peer-reviewed research papers, technical documentation, and academic 
              publications across various engineering disciplines.
            </p>
          </div>

          {/* Filters */}
          <ResearchFilters categories={categories as string[]} />

          {/* Research Grid */}
          <div className="space-y-6">
            {research.map((item) => (
              <ResearchCard
                key={item.id}
                id={item.id}
                title={item.title}
                abstract={item.abstract}
                authors={item.authors}
                keywords={item.keywords}
                category={item.category}
                imageUrl={item.image_url}
                viewCount={item.view_count}
                downloadCount={item.download_count}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
