import { Routes, Route, Navigate } from 'react-router-dom'
import AccroPage from './pages/AccroPage'

export default function App() {
  return (
    <Routes>
      <Route path="/accro" element={<AccroPage />} />
      <Route path="/" element={<Navigate to="/accro" replace />} />
    </Routes>
  )
}
