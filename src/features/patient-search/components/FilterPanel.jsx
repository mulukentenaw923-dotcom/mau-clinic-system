export default function FilterPanel({ children }) {
  return (
    <section aria-label="Patient filters" className="rounded-lg border border-slate-200 bg-white p-4">
      {children ?? <p className="text-sm text-slate-500">Patient filters will appear here.</p>}
    </section>
  );
}
