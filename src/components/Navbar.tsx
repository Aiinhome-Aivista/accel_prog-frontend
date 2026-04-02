import siteData from '../data/siteData.json'

const { nav } = siteData

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14">
        {/* Logo */}
        <a href="#" className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold"></span>
          </div>
          <span className="font-bold text-stone-900 text-sm tracking-tight">{nav.logo}</span>
        </a>

        {/* Links */}
        <div className="hidden md:flex items-center gap-6">
          {nav.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-stone-500 hover:text-stone-900 text-sm transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <a
          href="#"
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-1.5 rounded-md transition-colors duration-200"
        >
          {nav.cta}
        </a>
      </div>
    </nav>
  )
}
