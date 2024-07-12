import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import SignUp from './pages/Signup';
import Login from './pages/login';
import DashBoard from './pages/DashBoard';
import MyAppointment from './components/User/MyAppointment';
import DoctorHome from './components/Doctor/DoctorHome';
import AddSlot from './components/Doctor/AddSlot';
import Doctor from './components/Admin/Doctor';
import AddDoctor from './components/Admin/AddDoctor';
import User from './components/Admin/User';
import Profile from './components/User/Profile';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  const user = useSelector((state) => state.user);
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          {user && user.role === 'user' && (
            <>
              <Route path="/dashboard" element={<DashBoard />} />
              <Route path="/my-appointment" element={<MyAppointment />} />
              <Route path="/profile" element={<Profile />} />

            </>
          )}
          {user && user.role === 'doctor' && (
            <>
              <Route path="/doctor/home" element={<DoctorHome />} />
              <Route path="/doctor/slots" element={<AddSlot />} />
            </>
          )}
          {user && user.role === 'admin' && (
            <>
              <Route path="/admin/doctor" element={<Doctor />} />
              <Route path="/admin/add-doctor" element={<AddDoctor />} />
              <Route path="/admin/user" element={<User />} />
            </>
          )}

          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </Router>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
