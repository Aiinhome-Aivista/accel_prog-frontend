import siteData from '../data/siteData.json'

const { hero } = siteData

export default function Hero() {
  return (
    <section className="pt-36 pb-20 bg-[#FAF6F1]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
          {/* Left: Text Content */}
          <div className="flex-1 max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
              <span className="text-orange-500 text-xs font-semibold tracking-[0.15em] uppercase">
                {hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold text-stone-900 leading-tight mb-5">
              {hero.titleParts.map((part, i) =>
                part === hero.highlightWord ? (
                  <span key={i} className="text-orange-500">
                    {part}{' '}
                  </span>
                ) : (
                  <span key={i}>{part} </span>
                )
              )}
            </h1>

            {/* Description */}
            <p className="text-stone-500 text-sm leading-relaxed mb-8 max-w-md">
              {hero.description}
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-4">
              {hero.buttons.map((btn) =>
                btn.primary ? (
                  <a
                    key={btn.label}
                    href="#"
                    className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-md transition-colors duration-200"
                  >
                    {btn.label}
                  </a>
                ) : (
                  <a
                    key={btn.label}
                    href="#"
                    className="text-stone-700 hover:text-stone-900 text-sm font-medium transition-colors duration-200 underline underline-offset-2"
                  >
                    {btn.label}
                  </a>
                )
              )}
            </div>
          </div>

          {/* Right: Stats Grid */}
          <div className="flex-shrink-0">
            <div className="grid grid-cols-2 gap-3">
              {hero.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col items-center justify-center w-28 h-24 shadow-sm"
                >
                  <span className="text-3xl font-bold text-stone-900 leading-none">
                    {stat.value}
                  </span>
                  <span className="text-stone-400 text-xs mt-1.5 capitalize">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
