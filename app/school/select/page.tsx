'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, TrendingUp, Star, Zap } from 'lucide-react'
import { getAllSchools, searchSchools, School } from '@/lib/schools'
import SchoolCard from '@/components/SchoolCard'
import AddSchoolForm from '@/components/AddSchoolForm'
import { SchoolCardSkeleton } from '@/components/Skeleton'
import { useAuth } from '@/hooks/useAuth'

type SortOption = 'popularity' | 'rating' | 'activity'

const sortOptions: { value: SortOption; label: string; icon: React.ElementType }[] = [
  { value: 'popularity', label: 'Most Reviews', icon: TrendingUp },
  { value: 'rating', label: 'Top Rated', icon: Star },
  { value: 'activity', label: 'Recent Activity', icon: Zap },
]

export default function SchoolSelectPage() {
  const { user } = useAuth()
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortOption>('popularity')
  const [searching, setSearching] = useState(false)

  const loadSchools = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getAllSchools()
      setSchools(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadSchools() }, [loadSchools])

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setSearching(true)
        try {
          const results = await searchSchools(query, sort)
          setSchools(results)
        } finally {
          setSearching(false)
        }
      } else if (query.trim().length === 0) {
        loadSchools()
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [query, sort, loadSchools])

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="page-container py-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
          >
            <div>
              <h1 className="font-display text-3xl font-bold text-slate-900">Explore Schools</h1>
              <p className="text-slate-500 mt-1">
                {schools.length > 0 ? `${schools.length} schools listed` : 'Discover verified school insights'}
              </p>
            </div>
            {user && <AddSchoolForm onSuccess={loadSchools} />}
          </motion.div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by school name, city..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 transition-all"
            />
            {searching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
            )}
          </div>

          {/* Sort options */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <div className="flex gap-2">
              {sortOptions.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setSort(value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    sort === value
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* School grid */}
      <div className="page-container py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <SchoolCardSkeleton key={i} />)}
          </div>
        ) : schools.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-700 text-lg mb-2">
              {query ? `No schools found for "${query}"` : 'No schools yet'}
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              {query ? 'Try a different search term' : 'Be the first to add a school!'}
            </p>
            {user && <AddSchoolForm onSuccess={loadSchools} />}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {schools.map((school, i) => (
              <SchoolCard key={school.school_id} school={school} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
