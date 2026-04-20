'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ImagePlus, X } from 'lucide-react'
import { useOnboarding } from '@/hooks/useOnboarding'
import { INDIAN_STATES, BOARDS, GRADES, cn } from '@/lib/utils'
import StepShell from '../StepShell'
import { Field, Input, Select, Chip, NextBtn, Textarea } from '../FormParts'

const GENDERS = ['Male','Female','Other']
const SATISFACTION = [
  { value:'yes',     emoji:'😊', label:'Yes, very happy',      cls:'border-emerald-400/50 bg-emerald-500/15' },
  { value:'neutral', emoji:'😐', label:'Somewhat satisfied',   cls:'border-amber-400/50  bg-amber-500/15'   },
  { value:'no',      emoji:'😟', label:'Not satisfied',        cls:'border-red-400/50    bg-red-500/15'     },
]

export default function ParentInfoPage() {
  const router = useRouter()
  const { state, setParentInfo } = useOnboarding()
  const [form, setForm]     = useState(state.parentInfo)
  const [errors, setErrors] = useState<Record<string,string>>({})
  const [previews, setPreviews] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files||[]).slice(0,5)
    setForm(f => ({ ...f, photoFiles: files }))
    setPreviews(files.map(f => URL.createObjectURL(f)))
  }

  const validate = () => {
    const e: Record<string,string> = {}
    if (!form.parentName.trim())                            e.parentName    = 'Required'
    if (!form.childName.trim())                             e.childName     = 'Required'
    if (!form.childAge || +form.childAge<3||+form.childAge>20) e.childAge  = 'Enter valid age (3–20)'
    if (!form.childGender)                                  e.childGender   = 'Required'
    if (!form.grade)                                        e.grade         = 'Required'
    if (!form.schoolName.trim())                            e.schoolName    = 'Required'
    if (!form.schoolAddress.trim())                         e.schoolAddress = 'Required'
    if (!form.city.trim())                                  e.city          = 'Required'
    if (!form.state)                                        e.state         = 'Required'
    if (!form.board)                                        e.board         = 'Required'
    if (!form.happyWithSchool)                              e.happy         = 'Please share your satisfaction'
    return e
  }

  const next = () => {
    const e = validate(); if (Object.keys(e).length) { setErrors(e); return }
    setParentInfo(form); router.push('/onboarding/review-school')
  }

  return (
    <StepShell step={3} emoji="👨‍👩‍👧" title="Tell us about your child" subtitle="Your parent perspective is invaluable for other families making school decisions." onBack={() => router.push('/onboarding')}>
      <div className="space-y-4 max-h-[62vh] overflow-y-auto pr-1">

        {/* Parent */}
        <Field label="Your Name" required>
          <Input value={form.parentName} onChange={set('parentName')} placeholder="Your full name" />
          {errors.parentName && <p className="text-xs text-red-400">{errors.parentName}</p>}
        </Field>

        {/* Child */}
        <div className="border-t border-white/10 pt-4">
          <p className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-4">About Your Child</p>
          <div className="space-y-3">
            <Field label="Child's Name" required>
              <Input value={form.childName} onChange={set('childName')} placeholder="Child's full name" />
              {errors.childName && <p className="text-xs text-red-400">{errors.childName}</p>}
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Child's Age" required>
                <Input type="number" value={form.childAge} onChange={set('childAge')} placeholder="e.g. 12" min={3} max={20} />
                {errors.childAge && <p className="text-xs text-red-400">{errors.childAge}</p>}
              </Field>
              <Field label="Grade" required>
                <Select value={form.grade} onChange={set('grade')}>
                  <option value="">Select</option>
                  {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                </Select>
                {errors.grade && <p className="text-xs text-red-400">{errors.grade}</p>}
              </Field>
            </div>
            <Field label="Child's Gender" required>
              <div className="flex gap-2">{GENDERS.map(g => <Chip key={g} selected={form.childGender===g} onClick={()=>setForm(f=>({...f,childGender:g}))}>{g}</Chip>)}</div>
              {errors.childGender && <p className="text-xs text-red-400">{errors.childGender}</p>}
            </Field>
          </div>
        </div>

        {/* School */}
        <div className="border-t border-white/10 pt-4">
          <p className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-4">Child's School</p>
          <div className="space-y-3">
            <Field label="School Name" required>
              <Input value={form.schoolName} onChange={set('schoolName')} placeholder="e.g. St. Mary's School" />
              {errors.schoolName && <p className="text-xs text-red-400">{errors.schoolName}</p>}
            </Field>
            <Field label="Full Address" required hint="Building/Plot no., Street, Area, Landmark">
              <textarea value={form.schoolAddress} onChange={set('schoolAddress')} rows={2}
                placeholder="e.g. 14 Civil Lines, Opp. Nehru Park, Near Bus Stand"
                className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-400/60 resize-none transition-all" />
              {errors.schoolAddress && <p className="text-xs text-red-400">{errors.schoolAddress}</p>}
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="City" required>
                <Input value={form.city} onChange={set('city')} placeholder="e.g. Mumbai" />
                {errors.city && <p className="text-xs text-red-400">{errors.city}</p>}
              </Field>
              <Field label="Pincode">
                <Input value={form.schoolPincode} onChange={set('schoolPincode')} placeholder="e.g. 400001" maxLength={6} />
              </Field>
            </div>
            <Field label="State" required>
              <Select value={form.state} onChange={set('state')}>
                <option value="">Select state</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
              {errors.state && <p className="text-xs text-red-400">{errors.state}</p>}
            </Field>
            <Field label="Board" required>
              <div className="flex flex-wrap gap-2">{BOARDS.map(b => <Chip key={b} selected={form.board===b} onClick={()=>setForm(f=>({...f,board:b}))}>{b}</Chip>)}</div>
              {errors.board && <p className="text-xs text-red-400">{errors.board}</p>}
            </Field>
          </div>
        </div>

        {/* Satisfaction */}
        <div className="border-t border-white/10 pt-4">
          <p className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-3">Your Satisfaction</p>
          <p className="text-white/70 text-sm mb-3">Are you happy with the school your child attends?</p>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {SATISFACTION.map(({ value, emoji, label, cls }) => (
              <motion.button key={value} type="button" whileHover={{ y:-2 }} whileTap={{ scale:0.97 }}
                onClick={() => setForm(f => ({ ...f, happyWithSchool: value }))}
                className={cn('flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all',
                  form.happyWithSchool===value ? cls : 'border-white/10 bg-white/5 hover:border-white/20')}>
                <span className="text-2xl">{emoji}</span>
                <span className="text-xs text-white/70 text-center leading-tight">{label}</span>
              </motion.button>
            ))}
          </div>
          {errors.happy && <p className="text-xs text-red-400 mb-2">{errors.happy}</p>}
          <AnimatePresence>
            {(form.happyWithSchool==='no'||form.happyWithSchool==='neutral') && (
              <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}>
                <Field label="What are your main concerns?" hint="Helps future parents understand the reality">
                  <Textarea value={form.concerns} onChange={set('concerns')} rows={3} placeholder="e.g. Too much homework, teachers don't resolve doubts well..." />
                </Field>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Photos */}
        <div className="border-t border-white/10 pt-4">
          <p className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-3">School Photos <span className="normal-case font-normal text-white/25">(optional)</span></p>
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={handlePhotos} className="hidden" />
          {previews.length > 0 ? (
            <div className="grid grid-cols-4 gap-2">
              {previews.map((src,i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-white/10">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => { setPreviews(p=>p.filter((_,j)=>j!==i)); setForm(f=>({...f,photoFiles:f.photoFiles.filter((_,j)=>j!==i)})) }}
                    className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5"><X className="w-3 h-3 text-white" /></button>
                </div>
              ))}
              {previews.length<5 && <button type="button" onClick={()=>fileRef.current?.click()} className="aspect-square rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center hover:border-brand-400 transition-colors"><ImagePlus className="w-5 h-5 text-white/40" /></button>}
            </div>
          ) : (
            <button type="button" onClick={()=>fileRef.current?.click()} className="w-full py-5 border-2 border-dashed border-white/15 rounded-xl flex flex-col items-center gap-2 hover:border-brand-400/50 hover:bg-white/5 transition-all">
              <ImagePlus className="w-6 h-6 text-white/40" /><span className="text-sm text-white/40">Upload school photos</span>
            </button>
          )}
        </div>

        <div className="pt-2"><NextBtn onClick={next}>Find school & continue →</NextBtn></div>
      </div>
    </StepShell>
  )
}
