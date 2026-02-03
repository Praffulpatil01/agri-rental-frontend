export default function Input({
  placeholder,
  value,
  onChange,
  type = "text",
  inputMode,
  maxLength,
  ariaLabel,
  className = ""
}) {
  return (
    <input
      type={type}
      inputMode={inputMode}
      maxLength={maxLength}
      aria-label={ariaLabel || placeholder}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`
        w-full border border-gray-200 rounded-xl p-3.5 text-base text-gray-900 bg-gray-50
        placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white
        transition-all duration-200
        ${className}
      `}
    />
  );
} 
