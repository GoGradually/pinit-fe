import './TopBar.css'

type TopBarProps = {
  title: string
  showBackButton?: boolean
  onBack?: () => void
  showSettingsButton?: boolean
  onSettings?: () => void
}

const TopBar = ({
  title,
  showBackButton,
  onBack,
  showSettingsButton = true,
  onSettings,
}: TopBarProps) => {
  return (
    <header className="top-bar">
      <div className="top-bar__section">
        {showBackButton ? (
          <button className="top-bar__icon-button" onClick={onBack} aria-label="뒤로가기">
            ←
          </button>
        ) : (
          <span className="top-bar__placeholder" />
        )}
      </div>
      <div className="top-bar__title" aria-live="polite">
        {title}
      </div>
      <div className="top-bar__section">
        {showSettingsButton ? (
          <button
            className="top-bar__icon-button"
            onClick={onSettings}
            aria-label="설정"
          >
            ⚙️
          </button>
        ) : (
          <span className="top-bar__placeholder" />
        )}
      </div>
    </header>
  )
}

export default TopBar

