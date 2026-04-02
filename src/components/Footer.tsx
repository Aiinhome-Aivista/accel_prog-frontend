import siteData from '../data/siteData.json'

const { footer } = siteData

export default function Footer() {
  return (
    <footer className="bg-white border-t border-stone-200 py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo + tagline */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">V</span>
          </div>
          <div>
            <span className="font-bold text-stone-900 text-sm">{footer.logo}</span>
            <p className="text-stone-400 text-xs">{footer.tagline}</p>
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-5">
          {footer.links.map((link) => (
            <a
              key={link}
              href="#"
              className="text-stone-400 hover:text-stone-700 text-xs transition-colors duration-200"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
