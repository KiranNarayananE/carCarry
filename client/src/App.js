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
import TripPage from './pages/Admin/TripPage';
import UserHome from './pages/User/Home';
import Profile from './pages/User/Profile';
import Approve from './pages/Driver/Approve';
import UserRide from './pages/User/Ride';
import UserBookingDetailsPage from './pages/User/BookingDetails'
import AcceptRidePage from './pages/Driver/AcceptRide';
import UpcomingtripPage from './pages/Driver/UpcomingTrip';
import WalletPageDriver from './pages/Driver/Wallet';
import UserDrive from './pages/User/Drive';
import DriverHome from './pages/Driver/Home';
import UserPage from './pages/Admin/User';
import WalletPage from './pages/User/Wallet';
import CarProfilePage from './pages/Driver/CarProfile';
import SuccessPage from './pages/User/Success';
import BookingDetailsPage from './pages/Driver/BookingDetails';
import PendingBookingPage from './pages/Driver/PendingBooking';
import TripDetailsPage from './pages/Admin/TripDetails';
import ReportPage from './pages/Admin/Report';
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
      <Route path="/payment-success" element={isUser ?<SuccessPage />:<Navigate to="/login" />} />
      <Route path="/ride" element={isUser ?<UserRide />:<Navigate to="/login" />} />
      <Route path="/booking-details/:id" element={ isUser ? <UserBookingDetailsPage /> :<Navigate to="/login" />}/>
      <Route path="/profile" element={isUser ?<Profile />:<Navigate to="/login" />} />
      <Route path="/wallet" element={isUser ?<WalletPage />:<Navigate to="/login" />} />
      <Route path="/admin" element={isAdmin ? <Navigate to="/admin/home" /> :<AdminLogin />} />
      <Route path="/admin/home" element={isAdmin ? <AdminHome /> :<Navigate to="/admin" />} />
      <Route path="/admin/user" element={isAdmin ? <UserPage /> :<Navigate to="/admin" />} />
      <Route path="/admin/driver" element={isAdmin ? <DriverPage /> :<Navigate to="/admin" />} />
      <Route path="/admin/trips" element={ isAdmin ? <TripPage /> :<Navigate to="/admin" />}/>
      <Route path="/admin/booking-details/:id" element={ isAdmin ? <TripDetailsPage /> :<Navigate to="/admin" />}/>
      <Route path="/admin/driver-approval" element={isAdmin ? <DriverApprovalPage /> :<Navigate to="/admin" />} />
      <Route path="/admin/report" element={ isAdmin ? <ReportPage /> :<Navigate to="/admin" />}/>
      <Route path="/driver" element={isDriver ? <Navigate to="/driver/home" /> :< DriverLogin/>} />
      <Route path="/driver/signup" element={isDriver ? <Navigate to="/driver/home" /> :< DriverSignup/>} />
      <Route path="/driver/home" element={isDriver ? < DriverHome/> :<Navigate to="/driver" />} />
      <Route path="/driver/accept-ride" element={ isDriver ? <AcceptRidePage /> :<Navigate to="/driver" />}/> 
      <Route path="/driver/upcoming-trips" element={ isDriver ? <UpcomingtripPage /> :<Navigate to="/driver" />}/>
      <Route path="/driver/booking-details/:id" element={ isDriver ? <BookingDetailsPage /> :<Navigate to="/driver" />}/> 
      <Route path="/driver/pending-bookings" element={isDriver ? <PendingBookingPage /> : <Navigate to="/driver" />} /> 
      <Route path="/driver/wallet" element={isDriver ?<WalletPageDriver />:<Navigate to="/driver" />} />
      <Route path="/driver/carprofile" element={ isDriver ? <CarProfilePage /> :<Navigate to="/driver" />}/> 
      <Route path="/driver/approve" element={isDriver ? <Approve />:<Navigate to="/driver" />} />
    </Routes>
  </BrowserRouter>
);
}
 

export default App;
