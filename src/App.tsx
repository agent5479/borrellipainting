import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ExteriorSurfaces from './pages/quote/ExteriorSurfaces'
import IndoorRooms from './pages/quote/IndoorRooms'

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/quote/indoor" element={<IndoorRooms />} />
        <Route path="/quote/exterior" element={<ExteriorSurfaces />} />
        <Route path="/quote/freshcoat" element={<Navigate to="/quote/indoor" replace />} />
        <Route path="/quote/paintboard" element={<Navigate to="/quote/exterior" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
