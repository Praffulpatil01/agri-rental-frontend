import Button from "../components/Button";

export default function OperatorDashboard() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Operator Dashboard</h1>

      <div className="bg-yellow-100 p-4 rounded-lg mb-4">
        <p>New Booking Request</p>
        <p className="text-sm text-gray-600">Area: 2 Acres</p>
      </div>

      <div className="space-y-2">
        <Button label="Accept Job" />
        <Button label="Reject" type="secondary" />
      </div>
    </div>
  );
}
