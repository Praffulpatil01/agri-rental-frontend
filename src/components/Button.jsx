import { CgSpinner } from "react-icons/cg";

export default function Button({
  label,
  onClick,
  type = "primary",
  disabled = false,
  fullWidth = true,
  className = "",
  size = "md"
}) {
  const sizeClasses = {
    sm: "py-2 px-3 text-sm",
    md: "py-3 px-4 text-base",
    lg: "py-3.5 px-6 text-lg"
  }

  const base = `
    inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? "w-full" : ""}
    ${sizeClasses[size]}
    ${disabled ? "" : "active:scale-[0.98] hover:shadow-lg"}
  `;

  const styles = {
    primary: "bg-green-600 text-white hover:bg-green-700 shadow-green-200 focus:ring-green-500",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm focus:ring-gray-200",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 focus:ring-red-500",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${styles[type]} ${className}`}
      disabled={disabled}
    >
      {label}
    </button>
  );
} 
