import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import Estimates from './pages/Estimates'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ExteriorSurfaces from './pages/quote/ExteriorSurfaces'
import IndoorRooms from './pages/quote/IndoorRooms'
import QuotesTool from './pages/quotes/QuotesTool'

export function App() {
  return (
    <Routes>
      <Route path="/office" element={<QuotesTool />} />
      <Route path="/quotes/admin" element={<Navigate to="/office" replace />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/estimates" element={<Estimates />} />
        <Route path="/estimates/indoor" element={<IndoorRooms />} />
        <Route path="/estimates/exterior" element={<ExteriorSurfaces />} />
        <Route path="/quotes" element={<Navigate to="/estimates" replace />} />
        <Route path="/quotes/indoor" element={<Navigate to="/estimates/indoor" replace />} />
        <Route path="/quotes/exterior" element={<Navigate to="/estimates/exterior" replace />} />
        <Route path="/quote/indoor" element={<Navigate to="/estimates/indoor" replace />} />
        <Route path="/quote/exterior" element={<Navigate to="/estimates/exterior" replace />} />
        <Route path="/quote/freshcoat" element={<Navigate to="/estimates/indoor" replace />} />
        <Route path="/quote/paintboard" element={<Navigate to="/estimates/exterior" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
