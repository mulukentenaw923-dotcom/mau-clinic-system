export default function PrescribeMedication() {
  return (
    <form className="space-y-3">
      <label className="block text-sm font-medium">
        Medication
        <input className="mt-1 block w-full rounded-lg border border-slate-300 p-3" name="medication" />
      </label>
      <label className="block text-sm font-medium">
        Instructions
        <textarea className="mt-1 block w-full rounded-lg border border-slate-300 p-3" name="instructions" rows="3" />
      </label>
      <button className="rounded-lg bg-teal-700 px-4 py-2 text-white" type="submit">
        Add prescription
      </button>
    </form>
  );
}
