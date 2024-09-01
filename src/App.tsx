import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import PrivateRoute from './components/PrivateRoute'
import Navbar from './components/Navbar'

function App() {

  return (
    <>
      <h1>ProxyBioLine</h1>
      <Navbar />
      <div className="f">
        <div className="form-container"></div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Protected Route 👇 */}
          <Route element={<PrivateRoute />}>
            {/* <Route path="/" element={<Dashboard />} /> */}
          </Route>
        </Routes>
      </div>
    </>
  )
}

export default App;
