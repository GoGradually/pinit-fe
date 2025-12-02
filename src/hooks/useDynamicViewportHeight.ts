import { useEffect } from 'react'

const useDynamicViewportHeight = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const setViewportMetrics = () => {
      const viewport = window.visualViewport
      const height = viewport?.height ?? window.innerHeight
      const keyboardInset = viewport
        ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)
        : 0
      document.documentElement.style.setProperty('--app-viewport-height', `${height}px`)
      document.documentElement.style.setProperty('--app-keyboard-inset', `${keyboardInset}px`)
    }

    setViewportMetrics()

    const handleResize = () => setViewportMetrics()
    const handleFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
        setViewportMetrics()
      }
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)
    window.addEventListener('focusin', handleFocus)
    window.visualViewport?.addEventListener('resize', handleResize)
    window.visualViewport?.addEventListener('scroll', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
      window.removeEventListener('focusin', handleFocus)
      window.visualViewport?.removeEventListener('resize', handleResize)
      window.visualViewport?.removeEventListener('scroll', handleResize)
    }
  }, [])
}

export default useDynamicViewportHeight
