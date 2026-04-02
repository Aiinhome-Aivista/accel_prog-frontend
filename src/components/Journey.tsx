import siteData from '../data/siteData.json'

const { journey } = siteData

export default function Journey() {
  return (
    <section className="py-20 bg-[#FAF6F1]" id="programs">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
          <span className="text-orange-500 text-xs font-semibold tracking-[0.15em] uppercase">
            {journey.badge}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-stone-900 mb-3">{journey.title}</h2>

        {/* Description */}
        <p className="text-stone-500 text-sm leading-relaxed max-w-md mx-auto mb-14">
          {journey.description}
        </p>

        {/* Steps Timeline */}
        <div className="relative flex items-start justify-center gap-0">
          {journey.steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              {/* Step */}
              <div className="flex flex-col items-center w-36">
                {/* Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm z-10 relative shadow-sm ${
                    step.completed
                      ? 'bg-green-500'
                      : 'bg-orange-500'
                  }`}
                >
                  {step.completed ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                {/* Label */}
                <span className="text-stone-600 text-xs text-center mt-3 leading-snug px-2">
                  {step.title}
                </span>
              </div>

              {/* Connector line between steps */}
              {index < journey.steps.length - 1 && (
                <div className="w-24 h-px bg-stone-300 -mt-7 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
