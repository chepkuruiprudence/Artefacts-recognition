import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Heritage from './pages/Heritage'
import Classify from './pages/Classify'
import About from './pages/About'
import Contact from './pages/Contacts'
import Contribute from './pages/Contribute'
import Register from './pages/Register'
import Login from './pages/Login' 
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute';
import AdminPage from './pages/Admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/heritage" element={<Heritage />} />
        <Route path="/classify" element={<Classify />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/contribute" element={<Contribute />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path = "/profile" element={<Profile />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App