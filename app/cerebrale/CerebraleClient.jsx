'use client'
import dynamic from 'next/dynamic'
const CerebalePage = dynamic(() => import('../../src/views/CerebalePage'), { ssr: false })
export default function CerebraleClient() { return <CerebalePage /> }
