'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Loader2, CheckCircle2, Building2, ImagePlus, XCircle } from 'lucide-react'
import { addSchool } from '@/lib/schools'
import { useAuth } from '@/hooks/useAuth'
import { INDIAN_STATES, BOARDS, cn } from '@/lib/utils'

interface Props { onSuccess?: (schoolId: string) => void; className?: string }

export default function AddSchoolModal({ onSuccess, className }: Props) {
  const { user } = useAuth()
  const fileRef = useRef<HTMLInputElement>(null)
  const [open, setOpen]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')
  const [photos, setPhotos]   = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [form, setForm] = useState({
    name:'', address:'', city:'', state:'', pincode:'', board:''
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 5)
    setPhotos(files)
    setPreviews(files.map(f => URL.createObjectURL(f)))
  }

  const removePhoto = (i: number) => {
    setPhotos(p => p.filter((_,idx) => idx !== i))
    setPreviews(p => p.filter((_,idx) => idx !== i))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true); setError('')
    try {
      const school = await addSchool({ ...form, created_by: user.uid, photoFiles: photos })
      setSuccess(true)
      setTimeout(() => {
        setOpen(false); setSuccess(false)
        setForm({ name:'', address:'', city:'', state:'', pincode:'', board:'' })
        setPhotos([]); setPreviews([])
        onSuccess?.(school.school_id)
      }, 1500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add school')
    } finally { setLoading(false) }
  }

  return (
    <>
      <button onClick={() => setOpen(true)}
        className={cn('flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-2xl transition-all shadow-sm hover:shadow-md', className)}>
        <Plus className="w-4 h-4" />Add School
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={e => e.target === e.currentTarget && setOpen(false)}>
            <motion.div initial={{ opacity:0, scale:0.95, y:20 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg my-auto">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900">Add a School</h2>
                    <p className="text-xs text-slate-500">Help the community discover this school</p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {success ? (
                <div className="p-10 text-center">
                  <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:300 }}
                    className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </motion.div>
                  <p className="font-bold text-slate-900 text-lg">School Added!</p>
                  <p className="text-sm text-slate-500 mt-1">Now available for reviews</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">

                  {/* School Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">School Name *</label>
                    <input required value={form.name} onChange={set('name')} placeholder="e.g. Delhi Public School"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 transition-all" />
                  </div>

                  {/* Full Address */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Address *</label>
                    <textarea required value={form.address} onChange={set('address')} rows={2}
                      placeholder="Building/Plot no., Street, Area, Landmark"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 transition-all resize-none" />
                  </div>

                  {/* City + Pincode */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">City *</label>
                      <input required value={form.city} onChange={set('city')} placeholder="e.g. New Delhi"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Pincode</label>
                      <input value={form.pincode} onChange={set('pincode')} placeholder="e.g. 110001" maxLength={6}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 transition-all" />
                    </div>
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">State *</label>
                    <select required value={form.state} onChange={set('state')}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 transition-all">
                      <option value="">Select state</option>
                      {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* Board */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Board *</label>
                    <div className="flex flex-wrap gap-2">
                      {BOARDS.map(b => (
                        <button key={b} type="button" onClick={() => setForm(f => ({ ...f, board: b }))}
                          className={cn('px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
                            form.board === b ? 'bg-brand-600 text-white border-brand-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-brand-300')}>
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      School Photos <span className="text-slate-400 font-normal">(up to 5)</span>
                    </label>
                    <input ref={fileRef} type="file" accept="image/*" multiple onChange={handlePhotos} className="hidden" />

                    {previews.length > 0 ? (
                      <div className="grid grid-cols-4 gap-2 mb-2">
                        {previews.map((src, i) => (
                          <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100">
                            <img src={src} alt="" className="w-full h-full object-cover" />
                            <button type="button" onClick={() => removePhoto(i)}
                              className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5">
                              <X className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        ))}
                        {previews.length < 5 && (
                          <button type="button" onClick={() => fileRef.current?.click()}
                            className="aspect-square rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center hover:border-brand-400 transition-colors">
                            <Plus className="w-5 h-5 text-slate-400" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <button type="button" onClick={() => fileRef.current?.click()}
                        className="w-full py-6 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center gap-2 hover:border-brand-300 hover:bg-brand-50/30 transition-all">
                        <ImagePlus className="w-6 h-6 text-slate-400" />
                        <span className="text-sm text-slate-500">Click to upload school photos</span>
                        <span className="text-xs text-slate-400">JPG, PNG up to 5MB each</span>
                      </button>
                    )}
                  </div>

                  {error && <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>}

                  <button type="submit" disabled={loading || !form.board}
                    className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Adding...</> : 'Add School'}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
