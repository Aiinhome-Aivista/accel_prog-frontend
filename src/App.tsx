import { useEffect, useMemo, useState } from 'react'
import './App.css'
import LandingPage from './components/landing/LandingPage'
import DetailModal from './components/modals/DetailModal'
import SignInModal from './components/modals/SignInModal'
import RegistrationPage from './components/registration/RegistrationPage'
import { REG_SCHEMA } from './data/registrationSchema'
import type { CourseItem, FormDataMap, FormValue } from './types/registration'

function App() {
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
      alert(
        `Please complete these required fields:\n\n- ${incomplete.slice(0, 5).join('\n- ')}${incomplete.length > 5 ? `\n- ... and ${incomplete.length - 5} more` : ''
        }`,
      )
      return
    }



    setSubmitted(true)
  }

  return (
    <>
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
    </>
  )
}

export default App
