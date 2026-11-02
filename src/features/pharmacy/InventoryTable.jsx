import Table from '../../components/common/Table.jsx';

const columns = [
  { key: 'name', header: 'Medicine' },
  { key: 'quantity', header: 'Quantity' },
  { key: 'expiryDate', header: 'Expiry date' },
];

export default function InventoryTable({ inventory = [] }) {
  return <Table columns={columns} data={inventory} getRowKey={(item) => item.id} />;
}
