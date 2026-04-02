import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Journey from './components/Journey'
import Courses from './components/Courses'
import Impact from './components/Impact'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />

      {/* Divider */}
      <div className="h-px bg-stone-200 max-w-6xl mx-auto" />

      <Journey />

      {/* Divider */}
      <div className="h-px bg-stone-300" />

      <Courses />

      {/* Divider */}
      <div className="h-px bg-stone-200" />

      <Impact />

      <Footer />
    </div>
  )
}

export default App
