import { useTheme } from "../../context/ThemeContext";

function InputField({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  leftIcon,
  rightElement,
  error,
  disabled = false,
  readOnly = false,
  className = "",
}) {
  const { theme } = useTheme();

  return (
    <div className="w-full">
      {label && (
        <label
          className={`block mb-2 text-sm font-medium ${
            theme === "dark"
              ? "text-gray-300"
              : "text-gray-700"
          }`}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div
            className={`absolute left-4 top-1/2 -translate-y-1/2 ${
              theme === "dark"
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          >
            {leftIcon}
          </div>
        )}

        <input
          type={type}
          inputMode={type === "tel" ? "numeric" : undefined}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className={`
            w-full
            rounded-xl
            border
            py-3
            transition-all
            duration-300
            outline-none
            ${
              leftIcon ? "pl-12" : "pl-4"
            }
            ${
              rightElement ? "pr-12" : "pr-4"
            }
            ${
              theme === "dark"
                ? "bg-slate-800 border-slate-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500"
            }
            disabled:opacity-50
            disabled:cursor-not-allowed
            ${className}
          `}
        />

        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default InputField;