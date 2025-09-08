"use client";

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { hyperspeedPresets } from '@/lib/hyperspeedPresets'

// Create a fallback background component
const FallbackBackground = () => (
  <div className="fixed inset-0 -z-10">
    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.05),transparent_50%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.05),transparent_50%)]" />
  </div>
)

// Dynamically import HyperSpeed with error boundary
const Hyperspeed = dynamic(() => import('@/components/ui/HyperSpeed'), {
  ssr: false,
  loading: () => <FallbackBackground />
})

export default function SimpleBackground() {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Only try to load the advanced background after the page is fully loaded
    const timer = setTimeout(() => {
      setShowAdvanced(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // If there's an error or we haven't loaded yet, show fallback
  if (hasError || !showAdvanced) {
    return <FallbackBackground />
  }

  try {
    return (
      <div className="fixed inset-0 -z-10 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-700">
        <Hyperspeed effectOptions={hyperspeedPresets.one} />
      </div>
    )
  } catch (error) {
    console.error('HyperSpeed component failed to load:', error)
    setHasError(true)
    return <FallbackBackground />
  }
}
