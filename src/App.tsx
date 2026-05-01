import { Toaster } from 'react-hot-toast';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/features/Navbar';
import PrivateRoute from './components/features/PrivateRoute';
import RoleRoute from './components/features/RoleRoute';
import Footer from './components/ui/Footer';
import Header from './components/ui/Header';
import HomeGate from './components/features/HomeGate';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import ProducerSpace from './pages/ProducerSpace';
import NotFound from './pages/NotFound';

function App() {
  const location = useLocation();
  const isAuthRoute = location.pathname === "/login" || location.pathname === "/register";
  const showHeader = location.pathname === "/";

  return (
    <div className="app">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "14px",
            background: "rgba(17, 31, 48, 0.96)",
            color: "#f4f8f5",
            border: "1px solid rgba(255,255,255,0.12)",
            fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
            fontSize: "0.9rem",
          },
        }}
      />
      <Navbar />
      {showHeader && <Header />}
      <main className={`app-main${isAuthRoute ? " app-main--auth" : ""}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<HomeGate />} />
          <Route element={<PrivateRoute />}>
            <Route element={<RoleRoute allowedRoles={["PRODUCER"]} />}>
              <Route path="/espace-producteur" element={<ProducerSpace />} />
            </Route>
            <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App;
