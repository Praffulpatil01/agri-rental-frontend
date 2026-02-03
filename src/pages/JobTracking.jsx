import Button from "../components/Button";
import AppHeader from "../components/AppHeader";
import { useState } from "react";
import { FiPlay, FiSquare } from "react-icons/fi";

export default function JobTracking() {
  const [started, setStarted] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        <AppHeader title="Job Tracking" />

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-6">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-colors ${started ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
            {started ? <FiPlay className="text-4xl animate-pulse" /> : <FiSquare className="text-4xl" />}
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {started ? "Job in Progress" : "Ready to Start"}
            </h2>
            <p className="text-gray-500 mt-2">
              {started
                ? "Tracking time and location..."
                : "Click below to begin the job tracking."}
            </p>
          </div>

          <div className="w-full">
            {!started ? (
              <Button
                label="Start Job"
                onClick={() => setStarted(true)}
                type="primary"
                fullWidth
              />
            ) : (
              <Button
                label="End Job"
                type="danger"
                fullWidth
                onClick={() => setStarted(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
