'use client'
import dynamic from 'next/dynamic'
const LouvePage = dynamic(() => import('../../src/views/LouvePage'), { ssr: false })
export default function LouveRoute() { return <LouvePage /> }
