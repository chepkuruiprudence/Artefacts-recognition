import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Heritage from './pages/Heritage'
import Classify from './pages/Classify'
import About from './pages/About'
import Contact from './pages/Contacts'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/heritage" element={<Heritage />} />
        <Route path="/classify" element={<Classify />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App