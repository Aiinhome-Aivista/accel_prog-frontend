import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastProvider } from "./utils/ToastContext";
import { AuthProvider, useAuth } from "./hooks/context/AuthContext";
import {
  RegistrationProvider,
  useRegistration,
} from "./hooks/context/RegistrationContext";
import { DashboardProvider } from "./hooks/context/DashboardContext";

import LandingPage from "./features/pages/landing/LandingPage";
import DetailModal from "./modals/DetailModal";
import SignInModal from "./modals/SignInModal";
import RegistrationPage from "./features/pages/registration/RegistrationPage";
import Dashboard from "./features/pages/dashboard/Dashboard";
import ProtectedRoute from "./auth/ProtectedRoute";
import type { CourseItem } from "./types/registration";
import CourseLearning from "./features/pages/course-learning/course-learning";

// Effects component to handle route-based side effects like animations
function RouteEffects() {
  const location = useLocation();

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
  }, [location.pathname]);

  return null;
}

function AppContent() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [courseIndex, setCourseIndex] = useState<number | null>(null);
  const [courseData, setCourseData] = useState<CourseItem[]>([]);
  const [navOpen, setNavOpen] = useState(false);

  const { login, logout } = useAuth();
  const { resetRegistration } = useRegistration();

  const navigate = useNavigate();

  const handleSignIn = (
    isNewUser: boolean,
    email: string,
    name?: string,
    id?: number,
    access_control?: any[],
  ) => {
    setIsSignInOpen(false);
    if (name) {
      login({ id, name, email, access_control });
    }

    if (isNewUser) {
      navigate("/registration");
    } else {
      navigate("/dashboard");
    }
  };

  const handleLogout = () => {
    logout();
    resetRegistration();
    navigate("/");
    window.scrollTo(0, 0);
  };

  const handleGoHome = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <RouteEffects />
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              onSignInClick={() => setIsSignInOpen(true)}
              onExploreCourse={(index) => setCourseIndex(index)}
              onCoursesLoaded={(data) => setCourseData(data)}
              navOpen={navOpen}
              onToggleNav={() => setNavOpen((prev) => !prev)}
              onCloseNav={() => setNavOpen(false)}
              onGoHome={handleGoHome}
            />
          }
        />
        <Route
          path="/registration"
          element={
            <ProtectedRoute>
              <RegistrationPage onBackHome={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route path="/course-learning" element={<CourseLearning />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

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

function App() {
  return (
    //  <Router basename="/ap">
    <Router>
      <ToastProvider>
        <AuthProvider>
          <RegistrationProvider>
            <DashboardProvider>
              <AppContent />
            </DashboardProvider>
          </RegistrationProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
