export default function ToastNotification({ message, onDismiss, type = 'info' }) {
  const colors = {
    info: 'border-blue-200 bg-blue-50 text-blue-900',
    success: 'border-green-200 bg-green-50 text-green-900',
    error: 'border-red-200 bg-red-50 text-red-900',
  };

  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-lg border p-4 ${colors[type] ?? colors.info}`}
      role="status"
    >
      <span>{message}</span>
      {onDismiss && (
        <button aria-label="Dismiss notification" onClick={onDismiss} type="button">
          ×
        </button>
      )}
    </div>
  );
}
