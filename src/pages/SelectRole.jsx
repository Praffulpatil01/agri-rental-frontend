import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function SelectRole() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white p-6">
      <h2 className="text-xl font-semibold mb-6 text-center">
        Select Your Role
      </h2>

      <div className="space-y-4">
        <Button label="I am a Farmer" onClick={() => navigate("/farmer")} />
        <Button
          label="I am a Tractor Operator"
          type="secondary"
          onClick={() => navigate("/operator")}
        />
      </div>
    </div>
  );
}
