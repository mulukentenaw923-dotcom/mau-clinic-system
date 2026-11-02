import Table from '../../../components/common/Table.jsx';

const columns = [
  { key: 'name', header: 'Patient name' },
  { key: 'patientId', header: 'Patient ID' },
  { key: 'phone', header: 'Phone' },
];

export default function PatientTable({ patients = [] }) {
  return <Table columns={columns} data={patients} getRowKey={(patient) => patient.patientId} />;
}
