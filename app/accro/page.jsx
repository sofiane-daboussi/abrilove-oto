'use client'
import dynamic from 'next/dynamic'

const AccroPage = dynamic(() => import('../../src/views/AccroPage'), { ssr: false })

export default function AccroRoute() {
  return <AccroPage />
}
