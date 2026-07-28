function LoadingButton({
  loading,
  children,
  type = "submit",
  className = "",
  fullWidth = false,
  loadingText = "Saving...",
}) {
  return (
    <button
      type={type}
      disabled={loading}
      className={`
        ${fullWidth ? "w-full" : ""}
        px-8
        py-3
        rounded-xl
        font-semibold
        text-white
        bg-gradient-to-r
        from-blue-600
        to-indigo-600
        hover:from-blue-700
        hover:to-indigo-700
        hover:shadow-lg
        transition-all
        duration-300
        disabled:opacity-60
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {loading ? loadingText : children}
    </button>
  );
}

export default LoadingButton;