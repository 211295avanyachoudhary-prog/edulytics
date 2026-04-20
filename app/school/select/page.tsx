'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, TrendingUp, Star, Zap } from 'lucide-react'
import { getAllSchools, searchSchools, School } from '@/lib/schools'
import SchoolCard from '@/components/SchoolCard'
import AddSchoolModal from '@/components/AddSchoolModal'
import { SchoolCardSkeleton } from '@/components/Skeleton'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const SORT_OPTS = [
  { v:'popularity', l:'Most Reviews', icon:TrendingUp },
  { v:'rating',     l:'Top Rated',    icon:Star       },
  { v:'newest',     l:'Newest',       icon:Zap        },
] as const

export default function SchoolSelectPage() {
  const { user } = useAuth()
  const [schools,   setSchools]   = useState<School[]>([])
  const [loading,   setLoading]   = useState(true)
  const [query,     setQuery]     = useState('')
  const [sort,      setSort]      = useState<'popularity'|'rating'|'newest'>('popularity')
  const [searching, setSearching] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await getAllSchools()
    setSchools(data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    const t = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setSearching(true)
        const r = await searchSchools(query)
        setSchools(r)
        setSearching(false)
      } else if (!query.trim()) {
        load()
      }
    }, 380)
    return () => clearTimeout(t)
  }, [query, load])

  const sorted = [...schools].sort((a,b) =>
    sort === 'rating' ? b.avg_overall - a.avg_overall : sort === 'newest' ? 0 : b.review_count - a.review_count
  )

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Explore Schools</h1>
              <p className="text-slate-500 mt-1">{schools.length > 0 ? `${schools.length} schools listed` : 'Discover verified school insights'}</p>
            </div>
            {/* AddSchoolModal in header — clean right-aligned placement */}
            {user && <AddSchoolModal onSuccess={load} />}
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by school name, city…"
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 transition-all" />
            {searching && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            {SORT_OPTS.map(({ v, l, icon:Icon }) => (
              <button key={v} onClick={() => setSort(v)}
                className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all',
                  sort===v ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}>
                <Icon className="w-3 h-3" />{l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{[...Array(6)].map((_,i) => <SchoolCardSkeleton key={i} />)}</div>
        ) : sorted.length === 0 ? (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4"><Search className="w-8 h-8 text-slate-400" /></div>
            <h3 className="font-semibold text-slate-700 text-lg mb-2">{query ? `No results for "${query}"` : 'No schools yet'}</h3>
            <p className="text-slate-500 text-sm mb-6">{query ? 'Try a different search term' : 'Be the first to add a school!'}</p>
            {user && <AddSchoolModal onSuccess={load} />}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sorted.map((s,i) => <SchoolCard key={s.school_id} school={s} index={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}
