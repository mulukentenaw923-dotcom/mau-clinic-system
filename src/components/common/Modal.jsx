export default function Modal({ children, onClose, title }) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <section
        aria-labelledby="modal-title"
        aria-modal="true"
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
        role="dialog"
      >
        <h2 className="text-lg font-semibold text-slate-900" id="modal-title">
          {title}
        </h2>
        <div className="mt-4">{children}</div>
      </section>
    </div>
  );
}
