import { useEffect, useMemo, useState, useRef } from 'react'
import { PrimeReactProvider } from 'primereact/api'
import { Toast } from 'primereact/toast'
import 'primereact/resources/primereact.min.css'
import 'primereact/resources/themes/lara-light-cyan/theme.css'
import './App.css'
import LandingPage from './components/landing/LandingPage'
import DetailModal from './components/modals/DetailModal'
import SignInModal from './components/modals/SignInModal'
import RegistrationPage from './components/registration/RegistrationPage'
import { REG_SCHEMA } from './data/registrationSchema'
import type { CourseItem, FormDataMap, FormValue } from './types/registration'

function App() {
  const toast = useRef<Toast>(null)
  const [showRegistration, setShowRegistration] = useState(false)
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [courseIndex, setCourseIndex] = useState<number | null>(null)
  const [navOpen, setNavOpen] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState<FormDataMap>({})
  const [courseData, setCourseData] = useState<CourseItem[]>([])

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            intersectionObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )

    // Observe all current .fade-in elements
    const observeAll = () => {
      document.querySelectorAll('.fade-in:not(.visible)').forEach((el) => {
        intersectionObserver.observe(el)
      })
    }

    observeAll()

    // Watch for new .fade-in elements added to the DOM (e.g., after API calls)
    const mutationObserver = new MutationObserver(() => {
      observeAll()
    })

    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      intersectionObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [showRegistration])

  const isSectionComplete = (idx: number) => {
    const section = REG_SCHEMA[idx]
    const requiredFields = section.fields.filter((field) => field.required)

    if (requiredFields.length === 0) {
      return section.fields.some((field) => {
        const val = formData[field.id]
        if (Array.isArray(val)) return val.length > 0
        return val !== undefined && String(val).trim() !== ''
      })
    }

    return requiredFields.every((field) => {
      const val = formData[field.id]
      if (Array.isArray(val)) return val.length > 0
      return val !== undefined && String(val).trim() !== ''
    })
  }

  const progressPct = useMemo(() => {
    let filled = 0
    let total = 0

    REG_SCHEMA.forEach((section) => {
      section.fields.forEach((field) => {
        total += 1
        const val = formData[field.id]
        if (Array.isArray(val) && val.length > 0) {
          filled += 1
        } else if (val !== undefined && String(val).trim() !== '') {
          filled += 1
        }
      })
    })

    if (total === 0) return 0
    return submitted ? 100 : Math.round((filled / total) * 100)
  }, [formData, submitted])

  const handleSignInAndRegister = () => {
    setIsSignInOpen(false)
    setShowRegistration(true)
    setNavOpen(false)
    window.scrollTo(0, 0)
  }

  const handleBackToLanding = () => {
    setShowRegistration(false)
    setNavOpen(false)
    window.scrollTo(0, 0)
  }

  const handleUpdateField = (id: string, value: FormValue) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleToggleChip = (fieldId: string, value: string) => {
    setFormData((prev) => {
      const existing = Array.isArray(prev[fieldId]) ? [...(prev[fieldId] as string[])] : []
      const idx = existing.indexOf(value)
      if (idx >= 0) {
        existing.splice(idx, 1)
      } else {
        existing.push(value)
      }

      return { ...prev, [fieldId]: existing }
    })
  }

 

  const handleSubmit = () => {
    console.log("From Submit click")
    const incomplete: string[] = []


    console.log(formData)
    

    REG_SCHEMA.forEach((section) => {
      section.fields
        .filter((field) => field.required)
        .forEach((field) => {
          const val = formData[field.id]
          const filled = Array.isArray(val) ? val.length > 0 : val !== undefined && String(val).trim() !== ''
          if (!filled) incomplete.push(field.label)
        })
    })

    

    if (incomplete.length > 0) {
      toast.current?.show({
        severity: 'warn',
        life: 6000,
        content: () => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.9rem 1.1rem', width: '100%' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#b45309' }}>
              Incomplete Form
            </span>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#6b7280', lineHeight: 1.5 }}>
              Please fill in the following required fields before submitting:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {incomplete.slice(0, 5).map((f) => (
                <span
                  key={f}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '50px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    background: 'rgba(234, 88, 12, 0.08)',
                    color: '#ea580c',
                    border: '1px solid rgba(234, 88, 12, 0.2)',
                  }}
                >
                  <span style={{ fontSize: '0.65rem' }}>●</span> {f}
                </span>
              ))}
              {incomplete.length > 5 && (
                <span
                  style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: '50px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    background: '#f3f4f6',
                    color: '#6b7280',
                  }}
                >
                  +{incomplete.length - 5} more
                </span>
              )}
            </div>
          </div>
        ),
      })
      return
    }



    setSubmitted(true)
  }

  return (
    <PrimeReactProvider>
      <Toast ref={toast} />
      {!showRegistration ? (
        <LandingPage
          onSignInClick={() => setIsSignInOpen(true)}
          onExploreCourse={(index) => setCourseIndex(index)}
          onCoursesLoaded={(data) => setCourseData(data)}
          navOpen={navOpen}
          onToggleNav={() => setNavOpen((prev) => !prev)}
          onCloseNav={() => setNavOpen(false)}
        />
      ) : (
        <RegistrationPage
          currentSection={currentSection}
          schema={REG_SCHEMA}
          formData={formData}
          submitted={submitted}
          progressPct={progressPct}
          onBackHome={handleBackToLanding}
          onGoToSection={setCurrentSection}
          onUpdateField={handleUpdateField}
          onToggleChip={handleToggleChip}
          onSubmit={handleSubmit}
          isSectionComplete={isSectionComplete}
        />
      )}

      <SignInModal open={isSignInOpen} onClose={() => setIsSignInOpen(false)} onSignIn={handleSignInAndRegister} />
      <DetailModal courseIndex={courseIndex} courseData={courseData} onClose={() => setCourseIndex(null)} />
    </PrimeReactProvider>
  )
}

export default App
