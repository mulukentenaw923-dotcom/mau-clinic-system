export default function PatientQueue({ patients = [] }) {
  return (
    <section aria-labelledby="patient-queue-title">
      <h2 className="text-lg font-semibold" id="patient-queue-title">Patient queue</h2>
      {patients.length === 0 ? (
        <p className="mt-2 text-sm text-slate-500">No patients in the queue.</p>
      ) : (
        <ul className="mt-2 list-inside list-disc">
          {patients.map((patient) => <li key={patient.id}>{patient.name}</li>)}
        </ul>
      )}
    </section>
  );
}
