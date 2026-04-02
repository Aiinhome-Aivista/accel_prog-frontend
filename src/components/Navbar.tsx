import siteData from '../data/siteData.json'

const { nav } = siteData

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">

      {/* ── Top utility bar (dark navy) ── */}
      <div style={{ backgroundColor: '#1B2238' }} className="w-full">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-8 h-8">
          {nav.topBar.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`text-xs font-medium transition-colors duration-200 ${
                item.highlight
                  ? 'text-orange-400 hover:text-orange-300'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      {/* ── Main navbar (white) ── */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">

          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5">
            {/* Meditation / person SVG icon */}
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-orange-500"
            >
              {/* Head */}
              <circle cx="16" cy="7" r="3" fill="currentColor" />
              {/* Body sitting in meditation pose */}
              <path
                d="M16 11 C16 11 12 14 10 17 C9 18.5 10 20 11.5 20 L14 20 L14 24 C14 24.5 14.5 25 15 25 L17 25 C17.5 25 18 24.5 18 24 L18 20 L20.5 20 C22 20 23 18.5 22 17 C20 14 16 11 16 11Z"
                fill="currentColor"
              />
              {/* Left arm extended */}
              <path
                d="M10 18 C8 17 6.5 17.5 6 19"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              {/* Right arm extended */}
              <path
                d="M22 18 C24 17 25.5 17.5 26 19"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>

            <div className="flex flex-col leading-tight">
              <span className="text-orange-500 font-bold text-lg tracking-tight leading-none">
                {nav.logo}
              </span>
              <span className="text-gray-400 text-[10px] font-medium leading-tight">
                {nav.logoSubtitle}
              </span>
            </div>
          </a>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-7">
            {nav.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <a
            href="#"
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-md transition-colors duration-200 shadow-sm"
          >
            {nav.cta}
          </a>
        </div>
      </nav>
    </header>
  )
}
