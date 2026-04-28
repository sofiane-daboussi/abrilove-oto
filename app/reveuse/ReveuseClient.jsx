'use client'
import dynamic from 'next/dynamic'
const ReveusePage = dynamic(() => import('../../src/views/ReveusePage'), { ssr: false })
export default function ReveuseClient() { return <ReveusePage /> }
