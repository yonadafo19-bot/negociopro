import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const GoogleAnalytics = ({ measurementId }) => {
  const location = useLocation()

  useEffect(() => {
    if (measurementId && typeof window !== 'undefined') {
      // Load GA4 script
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
      document.head.appendChild(script)

      // Initialize gtag
      window.dataLayer = window.dataLayer || []
      window.gtag = function () {
        window.dataLayer.push(arguments)
      }
      window.gtag('js', new Date())
      window.gtag('config', measurementId)
    }
  }, [measurementId])

  // Track page views
  useEffect(() => {
    if (measurementId && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_location: window.location.href,
      })
    }
  }, [location, measurementId])

  return null
}

export default GoogleAnalytics
