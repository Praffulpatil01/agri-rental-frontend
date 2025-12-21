import Button from "../components/Button";
import { useState } from "react";

export default function JobTracking() {
  const [started, setStarted] = useState(false);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Job Tracking</h1>

      {!started ? (
        <Button label="Start Job" onClick={() => setStarted(true)} />
      ) : (
        <Button label="End Job" type="danger" />
      )}
    </div>
  );
}
