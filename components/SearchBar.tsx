'use client'
import { useState, useEffect, useRef } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { School, searchSchools } from '@/lib/schools'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface SearchBarProps {
  placeholder?: string
  onSelect?: (school: School) => void
  className?: string
}

export default function SearchBar({ placeholder = 'Search schools...', onSelect, className }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<School[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true)
        try {
          const res = await searchSchools(query)
          setResults(res)
          setOpen(true)
        } catch {
          setResults([])
        } finally {
          setLoading(false)
        }
      } else {
        setResults([])
        setOpen(false)
      }
    }, 350)

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSelect = (school: School) => {
    setQuery(school.name)
    setOpen(false)
    if (onSelect) onSelect(school)
    else router.push(`/school/${school.school_id}`)
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 transition-all shadow-sm"
        />
        {loading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />
        )}
        {!loading && query && (
          <button
            onClick={() => { setQuery(''); setResults([]); setOpen(false) }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-lg overflow-hidden z-50">
          {results.map((school) => (
            <button
              key={school.school_id}
              onClick={() => handleSelect(school)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0"
            >
              <div>
                <div className="text-sm font-medium text-slate-800">{school.name}</div>
                <div className="text-xs text-slate-500">{school.city}, {school.state} · {school.board}</div>
              </div>
              {school.avg_overall > 0 && (
                <span className="text-sm font-bold text-brand-600 ml-3">
                  {school.avg_overall.toFixed(1)}★
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {open && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-lg p-4 z-50">
          <p className="text-sm text-slate-500 text-center">No schools found for "{query}"</p>
        </div>
      )}
    </div>
  )
}
