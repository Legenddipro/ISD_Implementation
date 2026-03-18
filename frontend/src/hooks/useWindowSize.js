import { useEffect, useState } from 'react'

function getWindowSize() {
  if (typeof window === 'undefined') {
    return { width: 1024, height: 768 }
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState(getWindowSize)

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(getWindowSize())
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return windowSize
}

export default useWindowSize
