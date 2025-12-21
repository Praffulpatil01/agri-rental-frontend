import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function FarmerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Farmer Dashboard</h1>

      <div className="bg-green-100 p-4 rounded-lg mb-4">
        <p className="text-lg">Need tractor service?</p>
      </div>

      <Button
        label="Create New Booking"
        onClick={() => navigate("/create-booking")}
      />
    </div>
  );
}
