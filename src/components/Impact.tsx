import siteData from '../data/siteData.json'

const { impact } = siteData

export default function Impact() {
  return (
    <section className="py-20 bg-[#FAF6F1]" id="impact">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            <span className="text-orange-500 text-xs font-semibold tracking-[0.15em] uppercase">
              {impact.badge}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-stone-900 mb-3">{impact.title}</h2>
          <p className="text-stone-500 text-sm leading-relaxed max-w-md mx-auto">
            {impact.description}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {impact.features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white border border-stone-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-bold text-stone-900 text-sm mb-2">{feature.title}</h3>
              <p className="text-stone-500 text-xs leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Partners */}
        <div className="border-t border-stone-200 pt-10">
          <p className="text-center text-stone-400 text-xs font-semibold tracking-widest uppercase mb-6">
            Trusted by learners from
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {impact.partners.map((partner) => (
              <div
                key={partner.name}
                className="flex items-center gap-2 text-stone-400 hover:text-stone-600 transition-colors duration-200"
              >
                <div className="w-6 h-6 rounded-md bg-stone-200 flex items-center justify-center text-xs font-bold text-stone-500">
                  {partner.initial}
                </div>
                <span className="text-sm font-medium">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
