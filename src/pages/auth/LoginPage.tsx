import './LoginPage.css'

const LoginPage = () => {
  const handleNaverLogin = () => {
    console.log('TODO: connect Naver SSO redirect')
  }

  const handleGoogleLogin = () => {
    console.log('TODO: connect Google SSO redirect')
  }

  return (
    <div className="login">
      <div className="login__card">
        <div className="login__brand">
          <img src="/icons/icon.svg" alt="Pinit 로고" className="login__logo" />
          <span>Pinit</span>
        </div>
        <p className="login__eyebrow">Pinit · 모바일 우선</p>
        <h1>네이버 · Google SSO로 바로 시작</h1>
        <p className="login__description">
          비밀번호 없이 빠르게 접속하고 오늘의 우선순위를 확인하세요. 현재는 네이버, Google
          로그인만 지원합니다.
        </p>

        <div className="login__actions">
          <button type="button" className="login__btn login__btn--naver" onClick={handleNaverLogin}>
            <span className="login__icon">N</span>
            네이버로 계속하기
          </button>
          <button type="button" className="login__btn login__btn--google" onClick={handleGoogleLogin}>
            <span className="login__icon">G</span>
            Google로 계속하기
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
