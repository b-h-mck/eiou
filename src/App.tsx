import { BrowserRouter, Routes, Route } from 'react-router'
import './App.css'
import Layout from './features/Layout/Layout'
import Home from './features/Home/Home'
import Settings from './features/Settings/Settings'
import Help from './features/Help/Help'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
        </Route>
      </Routes>
  </BrowserRouter>
  )
}

export default App
