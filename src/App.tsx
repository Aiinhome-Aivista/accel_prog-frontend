import 'primereact/resources/primereact.min.css'
import 'primereact/resources/themes/lara-light-cyan/theme.css'
import "./App.css";
import LandingPage from "./components/landing/LandingPage";
import DetailModal from "./components/modals/DetailModal";
import SignInModal from "./components/modals/SignInModal";
import RegistrationPage from "./components/registration/RegistrationPage";
import { REG_SCHEMA } from "./data/registrationSchema";
import type { CourseItem, FormDataMap, FormValue } from "./types/registration";
import ProgramSelector from "./components/home/mokshPathDashboard";
import { useEffect, useMemo, useState } from 'react'
import { useToast } from './context/ToastContext'
import Dashboard from './components/dashboard/Dashboard'
import { authService } from './services/authService';

function App() {
  // 1. Unified navigation state from localStorage
  const [view, setView] = useState<"HOME" | "LANDING" | "REGISTRATION" | "DASHBOARD">(() => {
    return (localStorage.getItem("app_view") as any) || "HOME";
  });

  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem("user_name") || "";
  });

  const { showIncompleteFormToast } = useToast()
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [courseIndex, setCourseIndex] = useState<number | null>(null);
  const [navOpen, setNavOpen] = useState(false);

  const [currentSection, setCurrentSection] = useState(() => {
    return Number(localStorage.getItem("reg_section")) || 0;
  });

  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState<FormDataMap>(() => {
    try {
      const saved = localStorage.getItem("reg_form");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Persist view changes
  useEffect(() => {
    localStorage.setItem("app_view", view);
  }, [view]);

  // Persist registration progress
  useEffect(() => {
    localStorage.setItem("reg_form", JSON.stringify(formData));
    localStorage.setItem("reg_section", String(currentSection));
  }, [formData, currentSection]);
  const [courseData, setCourseData] = useState<CourseItem[]>([]);

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            intersectionObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    const observeAll = () => {
      document.querySelectorAll(".fade-in:not(.visible)").forEach((el) => {
        intersectionObserver.observe(el);
      });
    };

    observeAll();

    const mutationObserver = new MutationObserver(() => {
      observeAll();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [view]); // Run observer logic whenever the view switches

  const isSectionComplete = (idx: number) => {
    const section = REG_SCHEMA[idx];
    const requiredFields = section.fields.filter((field) => field.required);
    if (requiredFields.length === 0) {
      return section.fields.some((field) => {
        const val = formData[field.id];
        if (Array.isArray(val)) return val.length > 0;
        return val !== undefined && String(val).trim() !== "";
      });
    }
    return requiredFields.every((field) => {
      const val = formData[field.id];
      if (Array.isArray(val)) return val.length > 0;
      return val !== undefined && String(val).trim() !== "";
    });
  };

  const progressPct = useMemo(() => {
    let filled = 0;
    let total = 0;
    REG_SCHEMA.forEach((section) => {
      section.fields.forEach((field) => {
        total += 1;
        const val = formData[field.id];
        if (Array.isArray(val) && val.length > 0) filled += 1;
        else if (val !== undefined && String(val).trim() !== "") filled += 1;
      });
    });
    return total === 0 ? 0 : (submitted ? 100 : Math.round((filled / total) * 100));
  }, [formData, submitted]);

  // Navigation Handlers
  const handleSignIn = (isNewUser: boolean, email: string, name?: string) => {
    setIsSignInOpen(false);
    if (name) {
      setUserName(name);
      localStorage.setItem("user_name", name);
    }
    if (isNewUser) {
      setView("REGISTRATION");
      setFormData((prev) => ({ ...prev, email: email }));
    } else {
      setView("DASHBOARD");
    }
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    // 1. Reset all local state
    setView("HOME");
    setFormData({});
    setSubmitted(false);
    setCurrentSection(0);
    setNavOpen(false);
    setUserName("");
    
    // 2. Clear browser cache/storage
    localStorage.removeItem("token");
    localStorage.removeItem("app_view");
    localStorage.removeItem("reg_form");
    localStorage.removeItem("reg_section");
    localStorage.removeItem("user_name");
    
    // 3. Reset scroll
    window.scrollTo(0, 0);
  };


  const handleUpdateField = (id: string, value: FormValue) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleToggleChip = (fieldId: string, value: string) => {
    setFormData((prev) => {
      const existing = Array.isArray(prev[fieldId]) ? [...(prev[fieldId] as string[])] : [];
      const idx = existing.indexOf(value);
      idx >= 0 ? existing.splice(idx, 1) : existing.push(value);
      return { ...prev, [fieldId]: existing };
    });
  };

  const handleRegistrationUser = async(body: any)=>  {

  console.log("reg body", body); 
   const reg  =  await authService.registration(body); 

   console.log("reg response", reg);

   if(reg.status === "success"){

      setSubmitted(true);

   }

  }

  const buildCompletePayload = () => {
  const payload: FormDataMap = {};

  REG_SCHEMA.forEach((section) => {
    section.fields.forEach((field) => {
      const val = formData[field.id];

      if (val === undefined) {
        // Default empty values
        if (field.type === "chips") payload[field.id] = [];
        else payload[field.id] = "";
      } else {
        payload[field.id] = val;
      }
    });
  });

  return payload;
};

  const handleSubmit = () => {
    console.log(formData);


      
     
    const incomplete: string[] = [];
    REG_SCHEMA.forEach((section) => {
      section.fields.filter((field) => field.required).forEach((field) => {
        const val = formData[field.id];
        const filled = Array.isArray(val) ? val.length > 0 : val !== undefined && String(val).trim() !== "";
        if (!filled) incomplete.push(field.label);
      });
    });

    if (incomplete.length > 0) {
      showIncompleteFormToast(incomplete)
      return;
    }

  const completeData = buildCompletePayload();

  console.log("Final Payload:", completeData);

  handleRegistrationUser(completeData);
  

  
  };

  return (
    <>
      {/* 2. Logic-driven Rendering: Only one view shows at a time */}

      {view === "HOME" && (
        <ProgramSelector onSelectAccelerated={() => setView("LANDING")} />
      )}

      {view === "LANDING" && (
        <LandingPage
          onSignInClick={() => setIsSignInOpen(true)}
          onExploreCourse={(index) => setCourseIndex(index)}
          onCoursesLoaded={(data) => setCourseData(data)}
          navOpen={navOpen}
          onToggleNav={() => setNavOpen((prev) => !prev)}
          onCloseNav={() => setNavOpen(false)}
          onGoHome={() => setView("HOME")}
        />
      )}

      {view === "REGISTRATION" && (
        <RegistrationPage
          currentSection={currentSection}
          schema={REG_SCHEMA}
          formData={formData}
          submitted={submitted}
          progressPct={progressPct}
          onBackHome={handleLogout}
          onGoToSection={setCurrentSection}
          onUpdateField={handleUpdateField}
          onToggleChip={handleToggleChip}
          onSubmit={handleSubmit}
          isSectionComplete={isSectionComplete}
        />
      )}

      {view === "DASHBOARD" && (
        <Dashboard onLogout={handleLogout} userName={userName} />
      )}

      {/* Global Modals */}
      <SignInModal
        open={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onSignIn={handleSignIn}
      />


      <DetailModal
        courseIndex={courseIndex}
        courseData={courseData}
        onClose={() => setCourseIndex(null)}
      />
    </>
  );
}

export default App;