import { COURSE_DATA } from '../../data/courseData'
import BrandLogo from '../shared/BrandLogo'

interface LandingPageProps {
    onSignInClick: () => void
    onExploreCourse: (index: number) => void
    navOpen: boolean
    onToggleNav: () => void
    onCloseNav: () => void
}

function LandingPage({ onSignInClick, onExploreCourse, navOpen, onToggleNav, onCloseNav }: LandingPageProps) {
    return (
        <div className="landing-page" id="landingPage">
            <div className="top-bar">
                <a href="#">Request a Demo</a>
                <a href="#">FAQs</a>
                <a href="#">Help Center</a>
            </div>

            <nav className="nav">
                <a href="https://mokshpath.org/" className="nav-logo" onClick={onCloseNav}>
                    <BrandLogo />
                </a>

                <div className={`nav-links ${navOpen ? 'open' : ''}`} id="navLinks">
                    <a href="#pathway" onClick={onCloseNav}>
                        Program
                    </a>
                    <a href="#courses" onClick={onCloseNav}>
                        Courses
                    </a>
                    <a href="#features" onClick={onCloseNav}>
                        Why Us
                    </a>
                    <a href="#instructor" onClick={onCloseNav}>
                        Instructors
                    </a>
                    <a href="https://mokshpath.org/" target="_blank" rel="noreferrer" onClick={onCloseNav}>
                        Home
                    </a>
                    <button className="btn-signin btn-signin-fill" onClick={onSignInClick}>
                        Sign In
                    </button>
                </div>

                <button className="mobile-toggle" onClick={onToggleNav} aria-label="Toggle menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </nav>

            <section className="hero">
                <div className="hero-inner">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <span className="dot"></span> Summer 2026
                        </div>
                        <h1>
                            The <em>AI-Native</em> Summer Series
                        </h1>
                        <p className="hero-sub">
                            Four accelerated courses that take you from AI consumer to AI builder - from prompt engineering to autonomous agents. Curated by industry leaders.
                        </p>
                        <div className="hero-cta">
                            <button className="btn-signin btn-signin-fill" onClick={onSignInClick}>
                                Enroll Now
                            </button>
                            <button className="btn-signin btn-outline" onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}>
                                Explore Courses
                            </button>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="hero-circle"></div>
                        <div className="hero-stats-float">
                            <div className="hero-stat-card" style={{ animation: 'float 3s ease-in-out infinite' }}>
                                <div className="hero-stat-num">4</div>
                                <div className="hero-stat-label">Courses</div>
                            </div>
                            <div className="hero-stat-card" style={{ animation: 'float 3s ease-in-out .4s infinite' }}>
                                <div className="hero-stat-num">12</div>
                                <div className="hero-stat-label">Modules</div>
                            </div>
                            <div className="hero-stat-card" style={{ animation: 'float 3s ease-in-out .8s infinite' }}>
                                <div className="hero-stat-num">4</div>
                                <div className="hero-stat-label">Capstones</div>
                            </div>
                            <div className="hero-stat-card" style={{ animation: 'float 3s ease-in-out 1.2s infinite' }}>
                                <div className="hero-stat-num">20+</div>
                                <div className="hero-stat-label">Yrs Expertise</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="pathway">
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">
                            <div className="ico">
                                <svg viewBox="0 0 10 10" fill="none" aria-hidden="true">
                                    <path d="M1 5h8M5 1v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </div>
                            Learning Pathway
                        </div>
                        <div className="section-title">Your AI-Native Journey</div>
                        <p className="section-sub">Four progressive courses - each building on the last - from using AI to building autonomous systems.</p>
                    </div>

                    <div className="pathway-track fade-in">
                        <div className="pathway-step">
                            <div className="pathway-num">1</div>
                            <div className="pathway-week">Course 1</div>
                            <div className="pathway-name">AI Consumer & Builder</div>
                            <div className="pathway-sessions">Foundation</div>
                        </div>
                        <div className="pathway-step">
                            <div className="pathway-num">2</div>
                            <div className="pathway-week">Course 2</div>
                            <div className="pathway-name">Data & ML Architect</div>
                            <div className="pathway-sessions">Core</div>
                        </div>
                        <div className="pathway-step">
                            <div className="pathway-num">3</div>
                            <div className="pathway-week">Course 3</div>
                            <div className="pathway-name">Gen AI & RAG Specialist</div>
                            <div className="pathway-sessions">Applied</div>
                        </div>
                        <div className="pathway-step">
                            <div className="pathway-num">4</div>
                            <div className="pathway-week">Course 4</div>
                            <div className="pathway-name">Agentic & Deep Tech</div>
                            <div className="pathway-sessions">Advanced</div>
                        </div>
                    </div>

                    <div className="instructor-card fade-in" id="instructor">
                        <div className="instructor-icon-wrap">
                            <svg viewBox="0 0 50 50" fill="none" aria-hidden="true">
                                <circle cx="25" cy="15" r="7" stroke="#fff" strokeWidth="2" />
                                <path d="M12 38c0-5.5 5.8-10 13-10s13 4.5 13 10" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                                <circle cx="37" cy="15" r="5" stroke="#fff" strokeWidth="1.5" opacity=".6" />
                                <path d="M42 32c2.5 1 5 3.5 5 7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity=".6" />
                                <circle cx="13" cy="15" r="5" stroke="#fff" strokeWidth="1.5" opacity=".6" />
                                <path d="M8 32c-2.5 1-5 3.5-5 7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity=".6" />
                            </svg>
                        </div>
                        <div className="instructor-info">
                            <h3>Curated by Industry Leaders</h3>
                            <div className="instructor-role">
                                Designed and delivered by seasoned professionals with 20+ years of hands-on experience in AI, Machine Learning, Data Science, and Enterprise Technology.
                            </div>
                            <div className="instructor-creds">
                                <span className="instructor-cred">20+ Years Experience</span>
                                <span className="instructor-cred">Enterprise AI</span>
                                <span className="instructor-cred">Gen AI & LLMs</span>
                                <span className="instructor-cred">MLOps & Cloud</span>
                                <span className="instructor-cred">AI Governance</span>
                                <span className="instructor-cred">Deep Tech</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="courses">
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">
                            <div className="ico">
                                <svg viewBox="0 0 10 10" fill="none" aria-hidden="true">
                                    <rect x="1" y="1" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                                </svg>
                            </div>
                            Courses
                        </div>
                        <div className="section-title">Four Courses. One Transformation.</div>
                        <p className="section-sub">From using AI to building autonomous, enterprise-grade systems - each course ends with a real-world capstone.</p>
                    </div>

                    <div className="courses-grid">
                        {COURSE_DATA.map((course, index) => (
                            <div className="course-card fade-in" key={course.title}>
                                <div className="course-card-top"></div>
                                <div className="course-card-body">
                                    <div className="course-card-header">
                                        <div className="course-card-week">{course.label}</div>
                                        <div className="course-card-level">{course.level}</div>
                                    </div>

                                    <h3>{course.title}</h3>
                                    <div className="course-focus">{course.focus}</div>
                                    <p>{course.modules[0].desc}</p>

                                    <div className="course-meta">
                                        <div className="course-meta-item">3 Modules</div>
                                        <div className="course-meta-item">Capstone</div>
                                    </div>

                                    <div className="course-tags">
                                        {course.modules.map((module) => (
                                            <span className="course-tag" key={module.name}>
                                                {module.name.replace('Module 1: ', '').replace('Module 2: ', '').replace('Module 3: ', '').split(' ').slice(0, 2).join(' ')}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="course-outcome">
                                        <div className="course-outcome-label">Capstone</div>
                                        <p>{course.outcome}</p>
                                    </div>

                                    <button className="btn-explore" onClick={() => onExploreCourse(index)}>
                                        Explore More
                                        <svg viewBox="0 0 15 15" fill="none" aria-hidden="true">
                                            <path d="M3 7.5h9M8.5 4l3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="features">
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">
                            <div className="ico">*</div>
                            Why This Program
                        </div>
                        <div className="section-title">Built for Real Impact</div>
                        <p className="section-sub">Everything you need to go from AI consumer to AI builder - and beyond.</p>
                    </div>

                    <div className="features-grid">
                        {[
                            ['Project-Based Learning', 'Every course ends with a capstone - from AI research assistants to autonomous social-good agents.'],
                            ['Industry Leaders', 'Curated by professionals with 20+ years in AI, enterprise tech, and deep tech research.'],
                            ['AI-Native Approach', 'Learn to instruct AI, not just use it - from CoT prompting to multi-agent workflows.'],
                            ['Progressive Tracks', 'Foundation to Advanced - deep mastery through structured progression.'],
                            ['Real-World Relevance', 'Capstones grounded in real domains like MSMEs, agriculture, sustainability, and disaster response.'],
                            ['Responsible AI', 'Bias detection, data privacy, ethical frameworks, and AI governance woven into every course.'],
                        ].map(([title, desc]) => (
                            <div className="feature fade-in" key={title}>
                                <div className="feature-icon"></div>
                                <h4>{title}</h4>
                                <p>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <div className="container">
                    <div className="cta-box fade-in">
                        <h2>Ready to Become AI-Native?</h2>
                        <p>Join the Summer 2026 cohort and transform from AI consumer to AI builder with real-world capstone projects.</p>
                        <button className="btn-signin btn-signin-fill" onClick={onSignInClick}>
                            Enroll Now
                        </button>
                    </div>
                </div>
            </section>

            <footer>
                <div className="footer-inner">
                    <div className="footer-left">
                        <svg width="28" height="28" viewBox="0 0 42 42" fill="none" aria-hidden="true">
                            <circle cx="21" cy="14" r="6" fill="#E87A2E" />
                            <path d="M21 20c-6 0-10 3-10 7 0 2 1 3 2 4l2-3c1-1.5 2.5-2 3-2h6c.5 0 2 .5 3 2l2 3c1-1 2-2 2-4 0-4-4-7-10-7z" fill="#E87A2E" />
                            <path d="M11 31c0 0 2 4 10 4s10-4 10-4" stroke="#E87A2E" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <span className="footer-copy">Copyright 2026 MokshPath - Guided Path to True Learning</span>
                    </div>
                    <div className="footer-links">
                        <a href="https://mokshpath.org/" target="_blank" rel="noreferrer">
                            Home
                        </a>
                        <a href="#courses">Courses</a>
                        <a
                            href="#"
                            onClick={(event) => {
                                event.preventDefault()
                                onSignInClick()
                            }}
                        >
                            Sign In
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default LandingPage
