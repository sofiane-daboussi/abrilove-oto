'use client'
import dynamic from 'next/dynamic'
const ContactPage = dynamic(() => import('../../src/views/ContactPage'), { ssr: false })
export default function ContactClient() { return <ContactPage /> }
