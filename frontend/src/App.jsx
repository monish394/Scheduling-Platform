import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './Home';
import Login from './logres/Login';
import Register from './logres/Register';
import Dashboard from './Dashboard';
import Events from './Events';
import Availability from './Availability';
import Bookings from './Bookings';
import BookingPage from './BookingPage';
import CompleteProfile from './logres/CompleteProfile';

import './index.css';

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />

<Route path="/book/:username/:eventSlug" element={<BookingPage />} />

<Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/availability" element={<Availability />} />
        <Route path="/bookings" element={<Bookings />} />

<Route path="*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
