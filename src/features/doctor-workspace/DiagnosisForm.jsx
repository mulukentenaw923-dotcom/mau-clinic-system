export default function DiagnosisForm() {
  return (
    <form className="space-y-3">
      <label className="block text-sm font-medium">
        Diagnosis
        <textarea className="mt-1 block w-full rounded-lg border border-slate-300 p-3" rows="4" />
      </label>
      <button className="rounded-lg bg-teal-700 px-4 py-2 text-white" type="submit">
        Save diagnosis
      </button>
    </form>
  );
}
