import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ExteriorSurfaces from './pages/quote/ExteriorSurfaces'
import IndoorRooms from './pages/quote/IndoorRooms'
import QuotesHub from './pages/quotes/QuotesHub'
import QuotesTool from './pages/quotes/QuotesTool'

export function App() {
  return (
    <Routes>
      <Route path="/office" element={<QuotesTool />} />
      <Route path="/quotes/admin" element={<Navigate to="/office" replace />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/quotes" element={<QuotesHub />} />
        <Route path="/quotes/indoor" element={<IndoorRooms />} />
        <Route path="/quotes/exterior" element={<ExteriorSurfaces />} />
        <Route path="/quote/indoor" element={<Navigate to="/quotes/indoor" replace />} />
        <Route path="/quote/exterior" element={<Navigate to="/quotes/exterior" replace />} />
        <Route path="/quote/freshcoat" element={<Navigate to="/quotes/indoor" replace />} />
        <Route path="/quote/paintboard" element={<Navigate to="/quotes/exterior" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
