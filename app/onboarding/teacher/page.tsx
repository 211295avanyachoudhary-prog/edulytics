'use client'
export const dynamic = 'force-dynamic'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ImagePlus, X } from 'lucide-react'
import { useOnboarding } from '@/hooks/useOnboarding'
import { INDIAN_STATES, BOARDS, SUBJECTS } from '@/lib/utils'
import StepShell from '../StepShell'
import { Field, Input, Select, Chip, NextBtn } from '../FormParts'

const GENDERS     = ['Male','Female','Non-binary','Prefer not to say']
const EXPERIENCE  = ['< 1 year','1–3 years','3–5 years','5–10 years','10–20 years','20+ years']

export default function TeacherInfoPage() {
  const router = useRouter()
  const { state, setTeacherInfo } = useOnboarding()
  const [form, setForm]     = useState(state.teacherInfo)
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
    if (!form.name.trim())                            e.name           = 'Required'
    if (!form.age||+form.age<18||+form.age>75)        e.age            = 'Enter valid age (18–75)'
    if (!form.gender)                                 e.gender         = 'Required'
    if (!form.subject)                                e.subject        = 'Required'
    if (!form.yearsExperience)                        e.exp            = 'Required'
    if (!form.schoolName.trim())                      e.schoolName     = 'Required'
    if (!form.schoolAddress.trim())                   e.schoolAddress  = 'Required'
    if (!form.city.trim())                            e.city           = 'Required'
    if (!form.state)                                  e.state          = 'Required'
    if (!form.board)                                  e.board          = 'Required'
    return e
  }

  const next = () => {
    const e = validate(); if (Object.keys(e).length) { setErrors(e); return }
    setTeacherInfo(form); router.push('/onboarding/review-school')
  }

  return (
    <StepShell step={3} emoji="👩‍🏫" title="Tell us about yourself" subtitle="Educator perspectives reveal what parents and students never see." onBack={() => router.push('/onboarding')}>
      <div className="space-y-4 max-h-[62vh] overflow-y-auto pr-1">

        {/* Personal */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Full Name" required className="col-span-2">
            <Input value={form.name} onChange={set('name')} placeholder="Your full name" />
            {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
          </Field>
          <Field label="Age" required>
            <Input type="number" value={form.age} onChange={set('age')} placeholder="e.g. 34" min={18} max={75} />
            {errors.age && <p className="text-xs text-red-400">{errors.age}</p>}
          </Field>
          <Field label="Experience" required>
            <Select value={form.yearsExperience} onChange={set('yearsExperience')}>
              <option value="">Select</option>
              {EXPERIENCE.map(e => <option key={e} value={e}>{e}</option>)}
            </Select>
            {errors.exp && <p className="text-xs text-red-400">{errors.exp}</p>}
          </Field>
        </div>

        <Field label="Gender" required>
          <div className="flex flex-wrap gap-2">{GENDERS.map(g => <Chip key={g} selected={form.gender===g} onClick={()=>setForm(f=>({...f,gender:g}))}>{g}</Chip>)}</div>
          {errors.gender && <p className="text-xs text-red-400">{errors.gender}</p>}
        </Field>

        <Field label="Primary Subject" required>
          <div className="flex flex-wrap gap-2">{SUBJECTS.map(s => <Chip key={s} selected={form.subject===s} onClick={()=>setForm(f=>({...f,subject:s}))}>{s}</Chip>)}</div>
          {errors.subject && <p className="text-xs text-red-400">{errors.subject}</p>}
        </Field>

        {/* School */}
        <div className="border-t border-white/10 pt-4">
          <p className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-4">Your School</p>
          <div className="space-y-3">
            <Field label="School Name" required>
              <Input value={form.schoolName} onChange={set('schoolName')} placeholder="e.g. Kendriya Vidyalaya" />
              {errors.schoolName && <p className="text-xs text-red-400">{errors.schoolName}</p>}
            </Field>
            <Field label="Full Address" required hint="Building/Plot no., Street, Area, Landmark">
              <textarea value={form.schoolAddress} onChange={set('schoolAddress')} rows={2}
                placeholder="e.g. Sector 8, RK Puram, Near Community Centre"
                className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-400/60 resize-none transition-all" />
              {errors.schoolAddress && <p className="text-xs text-red-400">{errors.schoolAddress}</p>}
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="City" required>
                <Input value={form.city} onChange={set('city')} placeholder="e.g. Chennai" />
                {errors.city && <p className="text-xs text-red-400">{errors.city}</p>}
              </Field>
              <Field label="Pincode">
                <Input value={form.schoolPincode} onChange={set('schoolPincode')} placeholder="e.g. 600001" maxLength={6} />
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
