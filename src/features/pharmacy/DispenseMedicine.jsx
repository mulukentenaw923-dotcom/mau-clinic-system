export default function DispenseMedicine() {
  return (
    <form className="space-y-3">
      <label className="block text-sm font-medium">
        Prescription ID
        <input className="mt-1 block w-full rounded-lg border border-slate-300 p-3" name="prescriptionId" />
      </label>
      <button className="rounded-lg bg-teal-700 px-4 py-2 text-white" type="submit">
        Dispense medicine
      </button>
    </form>
  );
}
