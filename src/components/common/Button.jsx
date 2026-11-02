export default function Button({
  children,
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      className={`rounded-lg bg-teal-700 px-4 py-2 font-medium text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
