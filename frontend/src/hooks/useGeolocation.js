import { useEffect, useState } from 'react'

export const useGeolocation = () => {
  const [address, setAddress] = useState(() => {
    return localStorage.getItem('userLocation') || 'Kafrul, Dhaka'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`
      )
      const data = await response.json()
      
      const area = data.address.suburb || data.address.neighbourhood || data.address.city_district || ''
      const city = data.address.city || data.address.state || 'Dhaka'
      
      return area ? `${area}, ${city}` : city
    } catch (err) {
      console.error('Reverse geocoding failed:', err)
      return 'Kafrul, Dhaka'
    }
  }

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        const formattedAddress = await reverseGeocode(latitude, longitude)
        setAddress(formattedAddress)
        localStorage.setItem('userLocation', formattedAddress)
        setLoading(false)
      },
      (err) => {
        setError('Location access denied')
        setAddress('Kafrul, Dhaka')
        localStorage.setItem('userLocation', 'Kafrul, Dhaka')
        setLoading(false)
      }
    )
  }

  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation')
    if (!savedLocation) {
      requestLocation()
    }
  }, [])

  return { address, loading, error, requestLocation }
}