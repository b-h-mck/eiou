import { BrowserRouter, Routes, Route } from 'react-router'
import './App.css'
import Layout from './features/Layout/Layout'
import Home from './features/Home/Home'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          {/* <Route path="/person/:personId" element={<Person />} />
          <Route path="/txn/:txnId" element={<Txn />} /> */}

        </Route>
      </Routes>
  </BrowserRouter>
  )
}

export default App
