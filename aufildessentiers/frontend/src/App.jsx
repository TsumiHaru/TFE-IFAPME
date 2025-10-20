import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventsMap from "./pages/EventsMap";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Login from "./pages/Login";
import AuthProvider from "./context/AuthProvider";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import ForgotPassword from './pages/ForgotPassword';
import ChangePassword from './pages/ChangePassword';
import ResetPassword from './pages/ResetPassword';

import AnimatedWaveBackground from './components/AnimatedWaveBackground';

import TestAPI from "./pages/TestAPI";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app nature-bg">
          <AnimatedWaveBackground />
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<EventsMap />} />
              <Route path="/events-old" element={<Events />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profil" element={<Profile />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/test-api" element={<TestAPI />} />
              <Route path="*" element={<h1>404 - Page non trouvée</h1>} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
