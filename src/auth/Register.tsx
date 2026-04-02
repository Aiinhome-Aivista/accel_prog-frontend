import { useState, useEffect, useRef } from 'react'
import siteData from '../data/siteData.json'

const { registration: regData } = siteData

/* ─── Types ─── */
interface FieldDef {
  id: string
  label: string
  type: string
  placeholder?: string
  required?: boolean
  options?: string[]
  min?: number
  max?: number
  labels?: string[]
}

interface RegisterDialogProps {
  isOpen: boolean
  onClose: () => void
}

/* ─── Brand Logo (matches Navbar) ─── */
const BrandLogo = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="text-orange-500">
    <circle cx="16" cy="7" r="3" fill="currentColor" />
    <path d="M16 11 C16 11 12 14 10 17 C9 18.5 10 20 11.5 20 L14 20 L14 24 C14 24.5 14.5 25 15 25 L17 25 C17.5 25 18 24.5 18 24 L18 20 L20.5 20 C22 20 23 18.5 22 17 C20 14 16 11 16 11Z" fill="currentColor" />
    <path d="M10 18 C8 17 6.5 17.5 6 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M22 18 C24 17 25.5 17.5 26 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

/* ─── Register Dialog ─── */
export default function RegisterDialog({ isOpen, onClose }: RegisterDialogProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [formData, setFormData] = useState<Record<string, string | string[] | number>>({})
  const [submitted, setSubmitted] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  const sections = regData.sections

  /* Lock body scroll */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  /* Reset on close */
  useEffect(() => {
    if (!isOpen) {
      setCurrentSection(0)
      setFormData({})
      setSubmitted(false)
    }
  }, [isOpen])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose()
  }

  /* ─── Field helpers ─── */
  const updateField = (id: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const toggleChip = (fieldId: string, value: string) => {
    setFormData(prev => {
      const current = (prev[fieldId] as string[]) || []
      const idx = current.indexOf(value)
      const next = idx > -1 ? current.filter((_, i) => i !== idx) : [...current, value]
      return { ...prev, [fieldId]: next }
    })
  }

  const isFieldFilled = (id: string) => {
    const val = formData[id]
    if (Array.isArray(val)) return val.length > 0
    return val !== undefined && val !== null && String(val).trim() !== ''
  }

  /* ─── Section completeness ─── */
  const isSectionComplete = (idx: number) => {
    const section = sections[idx]
    const required = section.fields.filter((f: FieldDef) => f.required)
    if (required.length === 0) return section.fields.some((f: FieldDef) => isFieldFilled(f.id))
    return required.every((f: FieldDef) => isFieldFilled(f.id))
  }

  /* ─── Progress ─── */
  const getProgress = () => {
    let filled = 0
    let total = 0
    sections.forEach((s: { fields: FieldDef[] }) => {
      s.fields.forEach((f: FieldDef) => {
        total++
        if (isFieldFilled(f.id)) filled++
      })
    })
    return Math.round((filled / total) * 100)
  }

  /* ─── Submit ─── */
  const handleSubmit = () => {
    const incomplete: string[] = []
    sections.forEach((s: { fields: FieldDef[] }) => {
      s.fields.filter((f: FieldDef) => f.required).forEach((f: FieldDef) => {
        if (!isFieldFilled(f.id)) incomplete.push(f.label)
      })
    })
    if (incomplete.length > 0) {
      alert(`Please complete these required fields:\n\n• ${incomplete.slice(0, 5).join('\n• ')}${incomplete.length > 5 ? `\n• ... and ${incomplete.length - 5} more` : ''}`)
      return
    }
    console.log('Registration submitted:', formData)
    setSubmitted(true)
  }

  /* ─── Render a single field ─── */
  const renderField = (f: FieldDef) => {
    const val = formData[f.id]
    const filled = isFieldFilled(f.id)

    return (
      <div key={f.id} className="mb-5">
        <label className="block text-xs font-semibold text-stone-700 mb-1.5">
          {f.label}
          {f.required && <span className="text-orange-500 ml-0.5">*</span>}
          {filled && <span className="text-green-500 ml-1.5 text-[10px]">✓</span>}
        </label>

        {/* Text / Email / Tel */}
        {(f.type === 'text' || f.type === 'email' || f.type === 'tel') && (
          <input
            type={f.type}
            placeholder={f.placeholder || ''}
            value={(val as string) || ''}
            onChange={e => updateField(f.id, e.target.value)}
            className={`w-full px-3 py-2.5 rounded-xl border text-sm transition-all duration-200 outline-none
              ${filled
                ? 'border-green-300 bg-green-50/30 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100'
                : 'border-stone-200 bg-stone-50 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100'
              }`}
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          />
        )}

        {/* Textarea */}
        {f.type === 'textarea' && (
          <textarea
            placeholder={f.placeholder || ''}
            value={(val as string) || ''}
            onChange={e => updateField(f.id, e.target.value)}
            rows={3}
            className={`w-full px-3 py-2.5 rounded-xl border text-sm transition-all duration-200 outline-none resize-y min-h-[72px]
              ${filled
                ? 'border-green-300 bg-green-50/30 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100'
                : 'border-stone-200 bg-stone-50 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100'
              }`}
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          />
        )}

        {/* Select */}
        {f.type === 'select' && (
          <select
            value={(val as string) || ''}
            onChange={e => updateField(f.id, e.target.value)}
            className={`w-full px-3 py-2.5 rounded-xl border text-sm transition-all duration-200 outline-none appearance-none cursor-pointer
              bg-[length:12px] bg-[right_12px_center] bg-no-repeat
              ${filled
                ? 'border-green-300 bg-green-50/30 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100'
                : 'border-stone-200 bg-stone-50 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100'
              }`}
            style={{
              fontFamily: "'Montserrat', sans-serif",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 4.5l3 3 3-3' stroke='%239597A6' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`
            }}
          >
            <option value="">Select…</option>
            {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        )}

        {/* Chips */}
        {f.type === 'chips' && (
          <div className="flex flex-wrap gap-2 mt-1">
            {f.options?.map(o => {
              const selected = Array.isArray(val) && val.includes(o)
              return (
                <button
                  key={o}
                  type="button"
                  onClick={() => toggleChip(f.id, o)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer select-none
                    ${selected
                      ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                      : 'bg-stone-50 text-stone-500 border-stone-200 hover:border-orange-400 hover:text-orange-500'
                    }`}
                >
                  {o}
                </button>
              )
            })}
          </div>
        )}

        {/* Scale */}
        {f.type === 'scale' && (
          <div className="flex gap-2 items-end mt-1">
            {Array.from({ length: (f.max || 5) - (f.min || 1) + 1 }, (_, i) => (f.min || 1) + i).map(n => (
              <div key={n} className="text-center">
                <button
                  type="button"
                  onClick={() => updateField(f.id, n)}
                  className={`w-10 h-10 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer
                    ${val === n
                      ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                      : 'bg-stone-50 text-stone-500 border-stone-200 hover:border-orange-400 hover:text-orange-500'
                    }`}
                >
                  {n}
                </button>
                {f.labels && f.labels[n - (f.min || 1)] && (
                  <div className="text-[9px] text-stone-400 mt-1 max-w-[48px] leading-tight">
                    {f.labels[n - (f.min || 1)]}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (!isOpen) return null

  const progress = getProgress()

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-stone-900/50 backdrop-blur-sm"
      id="register-overlay"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-title"
        className="relative w-[95%] max-w-[880px] max-h-[90vh] bg-white rounded-2xl shadow-2xl flex overflow-hidden animate-in zoom-in-95 duration-300"
        style={{ fontFamily: "'Montserrat', 'Plus Jakarta Sans', sans-serif" }}
      >
        {/* ── Close ── */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* ═══ Sidebar ═══ */}
        <aside className="hidden md:flex flex-col w-[220px] bg-stone-50 border-r border-stone-200 p-5 flex-shrink-0">
          {/* Brand */}
          <div className="flex items-center gap-2 mb-5">
            <BrandLogo />
            <span className="text-sm font-bold text-orange-500" style={{ fontFamily: "'DM Serif Display', serif" }}>
              MokshPath
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-stone-800 mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>
            {regData.sidebarTitle}
          </h3>

          {/* Progress */}
          <div className="text-right text-[10px] font-bold text-orange-500 mb-1">{progress}% Complete</div>
          <div className="h-1.5 bg-stone-200 rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-green-500 rounded-full transition-all duration-400"
              style={{ width: `${submitted ? 100 : progress}%` }}
            />
          </div>

          {/* Section list */}
          <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
            {sections.map((s: { id: string; title: string }, i: number) => {
              const complete = isSectionComplete(i)
              const active = i === currentSection && !submitted
              return (
                <button
                  key={s.id}
                  onClick={() => { if (!submitted) setCurrentSection(i) }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-[11px] font-medium transition-all duration-200 cursor-pointer
                    ${active
                      ? 'bg-orange-100/80 text-orange-600 font-semibold'
                      : complete && !active
                        ? 'text-green-600 hover:bg-stone-100'
                        : 'text-stone-400 hover:bg-stone-100 hover:text-stone-600'
                    }`}
                >
                  {/* Dot */}
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-[8px] transition-all
                    ${active
                      ? 'border-orange-400 bg-orange-100'
                      : complete
                        ? 'border-green-400 bg-green-50'
                        : 'border-stone-300'
                    }`}>
                    {complete && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  {s.title}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* ═══ Main Form Area ═══ */}
        <main className="flex-1 flex flex-col min-h-0">
          {submitted ? (
            /* ── Success ── */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M8 20l8 8L32 12" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-stone-800 mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
                {regData.successTitle}
              </h2>
              <p className="text-sm text-stone-500 leading-relaxed max-w-sm mb-6">
                {regData.successMessage}
              </p>
              <button
                onClick={onClose}
                className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-sm"
              >
                {regData.successButton}
              </button>
            </div>
          ) : (
            <>
              {/* Mobile progress bar */}
              <div className="md:hidden px-5 pt-4 pb-2">
                <div className="flex items-center justify-between text-[10px] font-bold text-orange-500 mb-1">
                  <span>{sections[currentSection].title}</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-green-500 rounded-full transition-all duration-400" style={{ width: `${progress}%` }} />
                </div>
              </div>

              {/* Header */}
              <div className="px-6 pt-5 pb-4 border-b border-stone-100 bg-stone-50/50">
                <div className="flex items-center gap-2 text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Step {currentSection + 1} of {sections.length}
                </div>
                <h2 id="register-title" className="text-xl font-bold text-stone-800" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  {sections[currentSection].title}
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">{sections[currentSection].subtitle}</p>
              </div>

              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                {sections[currentSection].fields.map((f: FieldDef) => renderField(f))}
              </div>

              {/* Footer Nav */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-stone-100 bg-stone-50/50">
                {currentSection > 0 ? (
                  <button
                    onClick={() => setCurrentSection(currentSection - 1)}
                    className="flex items-center gap-1.5 text-sm text-stone-500 font-medium hover:text-orange-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-orange-50 cursor-pointer"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M9 3L4 7l5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {regData.prevLabel}
                  </button>
                ) : <div />}

                {currentSection < sections.length - 1 ? (
                  <button
                    onClick={() => setCurrentSection(currentSection + 1)}
                    className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors shadow-sm cursor-pointer"
                  >
                    {regData.nextLabel}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M5 3l5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors shadow-sm cursor-pointer"
                  >
                    {regData.submitLabel}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7l3.5 3.5L12 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
