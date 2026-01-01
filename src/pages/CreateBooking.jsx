import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../components/Button";
import { createBooking } from "../api/bookingApi";

export default function CreateBooking() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [area, setArea] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  console.log(state.prefill); 
  const { equipmentId, equipmentName, pricePerHour } = state.prefill;

  const handleSubmit = async () => {
    debugger;
    const res = await createBooking({
      machineId: equipmentId,
      area,
      scheduledAt
    });

    if (res.data.statusCode === 201) {
      alert("Booking created: " + res.data.data.bookingRef);
      navigate("/farmer");
    } else {
      alert(res.data.statusMessage);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Booking</h2>

      <p className="text-sm mb-2">{equipmentName}</p>
      <p className="text-sm mb-4">₹{pricePerHour}/hr</p>

      <input
        type="datetime-local"
        value={scheduledAt}
        onChange={e => setScheduledAt(e.target.value)}
        className="border p-2 w-full mb-3"
      />

      <input
        placeholder="Area (e.g., 2 acres)"
        value={area}
        onChange={e => setArea(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <Button label="Confirm Booking" onClick={handleSubmit} />
    </div>
  );
}



// import { useState } from "react";
// import Button from "../components/Button";
// import Input from "../components/Input";

// export default function CreateBooking() {
//   const [area, setArea] = useState("");
//   const [service, setService] = useState("");

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold mb-4">Create Booking</h1>

//       <div className="space-y-4">
//         <Input
//           placeholder="Area (in acres)"
//           value={area}
//           onChange={(e) => setArea(e.target.value)}
//         />

//         <select
//           className="w-full border rounded-lg p-3 text-lg"
//           value={service}
//           onChange={(e) => setService(e.target.value)}
//         >
//           <option value="">Select Service</option>
//           <option>Ploughing</option>
//           <option>Rotavator</option>
//           <option>Harvesting</option>
//         </select>

//         <Button label="Submit Booking" />
//       </div>
//     </div>
//   );
// }
