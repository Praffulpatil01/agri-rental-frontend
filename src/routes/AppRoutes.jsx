import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import SelectRole from "../pages/SelectRole";
import FarmerDashboard from "../pages/FarmerDashboard";
import CreateBooking from "../pages/CreateBooking";
import OperatorDashboard from "../pages/OperatorDashboard";
import JobTracking from "../pages/JobTracking";
import Signin from "../pages/Signin";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/role" element={<SelectRole />} />
        <Route path="/farmer" element={<FarmerDashboard />} />
        <Route path="/create-booking" element={<CreateBooking />} />
        <Route path="/operator" element={<OperatorDashboard />} />
        <Route path="/job" element={<JobTracking />} />
      </Routes>
    </BrowserRouter>
  );
}
