'use client'
import dynamic from 'next/dynamic'

const HomePage = dynamic(() => import('../src/views/HomePage'), { ssr: false })

export default function Home() {
  return <HomePage />
}
