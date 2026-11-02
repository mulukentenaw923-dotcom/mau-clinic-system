import FilterPanel from './components/FilterPanel.jsx';
import SearchBar from './components/SearchBar.jsx';
import PatientTable from './components/PatientTable.jsx';

export default function PatientSearchPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Patient search</h1>
      <SearchBar />
      <FilterPanel />
      <PatientTable />
    </section>
  );
}
