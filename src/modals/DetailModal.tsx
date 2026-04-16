import type { CourseItem } from '../types/registration'
import { DETAIL_BG, DETAIL_BORDER, DETAIL_TEXT } from '../data/courseData'

interface DetailModalProps {
    courseIndex: number | null
    courseData: CourseItem[]
    onClose: () => void
}

function DetailModal({ courseIndex, courseData, onClose }: DetailModalProps) {
    if (courseIndex === null) return null

    const course = courseData[courseIndex]
    if (!course) return null

    return (
        <div className="modal-overlay active" onClick={onClose}>
            <div className="detail-modal" onClick={(event) => event.stopPropagation()}>
                <button className="modal-close flex-center" onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 5 }} aria-label="Close course detail modal">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                        <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>

                <div className="detail-header">
                    <div
                        className="course-card-week"
                        style={{
                            background: DETAIL_BG[course.color],
                            color: DETAIL_TEXT[course.color],
                            display: 'inline-block',
                            padding: '.3rem .7rem',
                            borderRadius: '6px',
                            fontSize: '.68rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '.08em',
                        }}
                    >
                        {course.label} . {course.level}
                    </div>
                    <h2>{course.title}</h2>
                    <div className="detail-focus">{course.focus}</div>
                </div>

                <div className="detail-body">
                    {course.modules.map((module) => (
                        <div key={module.name} className="detail-module" style={{ borderLeftColor: DETAIL_BORDER[course.color] }}>
                            <h4>{module.name}</h4>
                            <p>{module.desc}</p>
                        </div>
                    ))}

                    <div className="detail-outcome-box">
                        <h4>Capstone Project</h4>
                        <p>{course.outcome}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetailModal
