import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";

export default function CreateBooking() {
  const [area, setArea] = useState("");
  const [service, setService] = useState("");

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Create Booking</h1>

      <div className="space-y-4">
        <Input
          placeholder="Area (in acres)"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />

        <select
          className="w-full border rounded-lg p-3 text-lg"
          value={service}
          onChange={(e) => setService(e.target.value)}
        >
          <option value="">Select Service</option>
          <option>Ploughing</option>
          <option>Rotavator</option>
          <option>Harvesting</option>
        </select>

        <Button label="Submit Booking" />
      </div>
    </div>
  );
}
