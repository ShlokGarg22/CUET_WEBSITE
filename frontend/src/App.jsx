import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import SubjectSession from './pages/SubjectSession.jsx'
import PerformanceReport from './pages/PerformanceReport.jsx'
import GoogleCallback from './pages/GoogleCallback.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<Signup />} />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />
      <Route path="/auth/callback" element={<GoogleCallback />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/session/:subjectId" element={<SubjectSession />} />
      <Route path="/session/:subjectId/report" element={<PerformanceReport />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
