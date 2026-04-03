import LogoIcon from '../../assets/logogod.svg'

interface BrandLogoProps {
    compact?: boolean
}

function BrandLogo({ compact = false }: BrandLogoProps) {
    return (
        <>
            <img 
                src={LogoIcon} 
                className="nav-logo-icon" 
                alt="Logo"
                aria-hidden="true"
            />
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
