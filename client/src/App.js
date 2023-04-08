import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import UserSignup from './pages/User/Signup';
import UserLogin from './pages/User/Login';
import UserOtp from './pages/User/Otp';
import UserPassword from './pages/User/Password';
import AdminLogin from './pages/Admin/Login';
import AdminHome from './pages/Admin/Home';
import DriverLogin from './pages/Driver/Login';
import DriverSignup from './pages/Driver/Signup';
import DriverApprovalPage from './pages/Admin/DriverPending';
import DriverPage from './pages/Admin/DriverPage';
import UserHome from './pages/User/Home';
import Approve from './pages/Driver/Approve';
import UserRide from './pages/User/Ride';
import AcceptRidePage from './pages/Driver/AcceptRide';
import UpcomingtripPage from './pages/Driver/UpcomingTrip';
import UserDrive from './pages/User/Drive';
import DriverHome from './pages/Driver/Home';
import UserPage from './pages/Admin/User';
function App() {
  const isDriver = Boolean(useSelector((state) => state.driverLogin.token));
  const isAdmin = Boolean(useSelector((state) => state.adminLogin.token));
  const isUser = Boolean(useSelector((state) => state.userLogin.token));
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/signup" element={isUser ? <Navigate to="/" /> :<UserSignup />} />
      <Route path="/login" element={isUser ? <Navigate to="/" /> :<UserLogin />} />
      <Route path="/otp" element={isUser ? <Navigate to="/" /> :<UserOtp />} />
      <Route path="/password" element={isUser ? <Navigate to="/" /> :<UserPassword />} />
      <Route path="/" element={<UserHome />} />
      <Route path="/drive" element={isUser ?<UserDrive />:<Navigate to="/login" />} />
      <Route path="/ride" element={isUser ?<UserRide />:<Navigate to="/login" />} />
      <Route path="/admin" element={isAdmin ? <Navigate to="/admin/home" /> :<AdminLogin />} />
      <Route path="/admin/home" element={isAdmin ? <AdminHome /> :<Navigate to="/admin" />} />
      <Route path="/admin/user" element={isAdmin ? <UserPage /> :<Navigate to="/admin" />} />
      <Route path="/admin/driver" element={isAdmin ? <DriverPage /> :<Navigate to="/admin" />} />
      <Route path="/admin/driver-approval" element={isAdmin ? <DriverApprovalPage /> :<Navigate to="/admin" />} />
      <Route path="/driver" element={isDriver ? <Navigate to="/driver/home" /> :< DriverLogin/>} />
      <Route path="/driver/signup" element={isDriver ? <Navigate to="/driver/home" /> :< DriverSignup/>} />
      <Route path="/driver/home" element={isDriver ? < DriverHome/> :<Navigate to="/driver" />} />
      <Route path="/driver/accept-ride" element={ isDriver ? <AcceptRidePage /> :<Navigate to="/driver" />}/> 
      <Route path="/driver/upcoming-trips" element={ isDriver ? <UpcomingtripPage /> :<Navigate to="/driver" />}/> 
      <Route path="/driver/approve" element={isDriver ? <Approve />:<Navigate to="/driver" />} />
    </Routes>
  </BrowserRouter>
);
}
 

export default App;
