import { Toaster } from 'react-hot-toast';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/features/Navbar';
import PrivateRoute from './components/features/PrivateRoute';
import Footer from './components/ui/Footer';
import Header from './components/ui/Header';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {

  return (
    <div className="app">
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />
      <Header />
      <div className="f">
        <div className="form-container"></div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Protected Route 👇 */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App;
