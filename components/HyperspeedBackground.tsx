"use client";

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the HyperSpeed component to avoid chunk loading issues
const Hyperspeed = dynamic(() => import('@/components/ui/HyperSpeed'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 -z-10 bg-blue-700" />
})

import { hyperspeedPresets } from '@/lib/hyperspeedPresets'

export default function HyperspeedBackground() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div className="fixed inset-0 -z-10 bg-blue-700" />
  }

  return (
    <div className="fixed inset-0 -z-10 bg-blue-700">
      <Hyperspeed effectOptions={hyperspeedPresets.one} />
    </div>
  )
}
