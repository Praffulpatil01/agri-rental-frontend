import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiLogOut } from "react-icons/fi";
import LanguageSwitcher from "./LanguageSwitcher";

export default function AppHeader({ title }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between py-4 mb-2">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
        {user?.fullName && (
          <p className="text-sm text-gray-500 font-medium">Hello, {user.fullName}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="p-2.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          title="Logout"
          aria-label="Logout"
        >
          <FiLogOut className="text-lg" />
        </button>
      </div>
    </div>
  );
}
