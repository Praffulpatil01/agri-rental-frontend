import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AppHeader({ title }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between bg-green-600 text-white p-4">
      <div>
        <h1 className="text-lg font-bold">{title}</h1>
        <p className="text-xs opacity-90">{user?.fullName}</p>
      </div>

      <button
        onClick={() => {
          logout();
          navigate("/");
        }}
        className="text-sm bg-white text-green-700 px-3 py-1 rounded"
      >
        Logout
      </button>
    </div>
  );
}
