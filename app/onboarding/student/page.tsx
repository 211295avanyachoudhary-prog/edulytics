'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ImagePlus, X } from 'lucide-react'
import { useOnboarding } from '@/hooks/useOnboarding'
import { INDIAN_STATES, BOARDS, GRADES } from '@/lib/utils'
import StepShell from '../StepShell'
import { Field, Input, Select, Chip, NextBtn } from '../FormParts'

const GENDERS = ['Male','Female','Non-binary','Prefer not to say']

export default function StudentInfoPage() {
  const router = useRouter()
  const { state, setStudentInfo } = useOnboarding()
  const [form, setForm]     = useState(state.studentInfo)
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
    if (!form.name.trim())                              e.name        = 'Required'
    if (!form.age || +form.age<4 || +form.age>22)      e.age         = 'Enter valid age (4–22)'
    if (!form.gender)                                   e.gender      = 'Required'
    if (!form.grade)                                    e.grade       = 'Required'
    if (!form.schoolName.trim())                        e.schoolName  = 'Required'
    if (!form.schoolAddress.trim())                     e.schoolAddress = 'Required'
    if (!form.city.trim())                              e.city        = 'Required'
    if (!form.state)                                    e.state       = 'Required'
    if (!form.board)                                    e.board       = 'Required'
    return e
  }

  const next = () => {
    const e = validate(); if (Object.keys(e).length) { setErrors(e); return }
    setStudentInfo(form); router.push('/onboarding/review-school')
  }

  return (
    <StepShell step={3} emoji="🎒" title="Tell us about yourself" subtitle="We'll use this to find your school and personalise your review." onBack={() => router.push('/onboarding')}>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">

        {/* Personal */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Full Name" required className="col-span-2">
            <Input value={form.name} onChange={set('name')} placeholder="Your full name" />
            {errors.name && <p className="text-xs text-red-400 mt-0.5">{errors.name}</p>}
          </Field>
          <Field label="Age" required>
            <Input type="number" value={form.age} onChange={set('age')} placeholder="e.g. 16" min={4} max={22} />
            {errors.age && <p className="text-xs text-red-400 mt-0.5">{errors.age}</p>}
          </Field>
          <Field label="Grade" required>
            <Select value={form.grade} onChange={set('grade')}>
              <option value="">Select</option>
              {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </Select>
            {errors.grade && <p className="text-xs text-red-400 mt-0.5">{errors.grade}</p>}
          </Field>
        </div>

        <Field label="Gender" required>
          <div className="flex flex-wrap gap-2">{GENDERS.map(g => <Chip key={g} selected={form.gender===g} onClick={()=>setForm(f=>({...f,gender:g}))}>{g}</Chip>)}</div>
          {errors.gender && <p className="text-xs text-red-400">{errors.gender}</p>}
        </Field>

        {/* School */}
        <div className="border-t border-white/10 pt-4">
          <p className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-4">Your School</p>

          <div className="space-y-3">
            <Field label="School Name" required>
              <Input value={form.schoolName} onChange={set('schoolName')} placeholder="e.g. Delhi Public School" />
              {errors.schoolName && <p className="text-xs text-red-400">{errors.schoolName}</p>}
            </Field>

            <Field label="Full Address" required hint="Building/Plot no., Street, Area, Landmark">
              <textarea value={form.schoolAddress} onChange={set('schoolAddress')} rows={2} placeholder="e.g. Plot 12, Sector 12, RK Puram, Near Metro Station"
                className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-400/60 resize-none transition-all" />
              {errors.schoolAddress && <p className="text-xs text-red-400">{errors.schoolAddress}</p>}
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="City" required>
                <Input value={form.city} onChange={set('city')} placeholder="e.g. New Delhi" />
                {errors.city && <p className="text-xs text-red-400">{errors.city}</p>}
              </Field>
              <Field label="Pincode">
                <Input value={form.schoolPincode} onChange={set('schoolPincode')} placeholder="e.g. 110001" maxLength={6} />
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

        {/* Photos */}
        <div className="border-t border-white/10 pt-4">
          <p className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-3">School Photos <span className="normal-case font-normal text-white/25">(optional, up to 5)</span></p>
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
              <ImagePlus className="w-6 h-6 text-white/40" />
              <span className="text-sm text-white/40">Upload school photos</span>
            </button>
          )}
        </div>

        <div className="pt-2"><NextBtn onClick={next}>Find my school & continue →</NextBtn></div>
      </div>
    </StepShell>
  )
}
