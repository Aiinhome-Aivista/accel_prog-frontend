interface BrandLogoProps {
    compact?: boolean
}

function BrandLogo({ compact = false }: BrandLogoProps) {
    return (
        <>
            <svg className={compact ? '' : 'nav-logo-icon'} viewBox="0 0 42 42" fill="none" aria-hidden="true">
                <circle cx="21" cy="14" r="6" fill="#E87A2E" />
                <path d="M21 20c-6 0-10 3-10 7 0 2 1 3 2 4l2-3c1-1.5 2.5-2 3-2h6c.5 0 2 .5 3 2l2 3c1-1 2-2 2-4 0-4-4-7-10-7z" fill="#E87A2E" />
                <path d="M11 31c0 0 2 4 10 4s10-4 10-4" stroke="#E87A2E" strokeWidth="1.5" strokeLinecap="round" />
                {!compact ? (
                    <>
                        <ellipse cx="21" cy="38" rx="8" ry="2" fill="#E87A2E" opacity=".15" />
                        <path d="M8 27l-3 2m29-2l3 2" stroke="#E87A2E" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="21" cy="14" r="3" fill="#FFF" opacity=".3" />
                    </>
                ) : null}
            </svg>
            <div className="nav-logo-text">
                <span className="nav-logo-name">
                    Moksh<span>Path</span>
                </span>
                {!compact ? <span className="nav-logo-tag">Guided Path to True Learning</span> : null}
            </div>
        </>
    )
}

export default BrandLogo
