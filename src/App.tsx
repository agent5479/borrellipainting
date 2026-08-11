import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import FreshCoat from './pages/quote/FreshCoat'
import PaintBoard from './pages/quote/PaintBoard'

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/quote/freshcoat" element={<FreshCoat />} />
        <Route path="/quote/paintboard" element={<PaintBoard />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
