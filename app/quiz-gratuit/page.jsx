'use client'
import dynamic from 'next/dynamic'

const QuizPage = dynamic(() => import('../../src/views/QuizPage'), { ssr: false })

export default function QuizGratuit() {
  return <QuizPage />
}
