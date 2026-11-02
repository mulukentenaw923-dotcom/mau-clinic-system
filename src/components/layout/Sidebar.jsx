import { useState } from 'react';

const navigation = [
  { id: 'dashboard', label: 'Overview' },
  { id: 'doctor', label: 'Doctor' },
  { id: 'patients', label: 'Patients' },
  { id: 'pharmacy', label: 'Pharmacy' },
  { id: 'leave', label: 'Sick leave' },
];

export default function Sidebar({ activePage, onNavigate }) {
  const [selectedPage, setSelectedPage] = useState('dashboard');
  const isControlled = activePage !== undefined && activePage !== null;
  const currentPage = activePage ?? selectedPage;

  function navigate(page) {
    if (!isControlled) setSelectedPage(page);
    onNavigate?.(page);
  }

  return (
    <aside className="w-full border-b border-slate-200 bg-white p-4 md:min-h-screen md:w-60 md:border-b-0 md:border-r">
      <nav aria-label="Main navigation">
        <ul className="flex gap-2 overflow-x-auto md:flex-col">
          {navigation.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <li key={item.id}>
                <button
                  aria-current={isActive ? 'page' : undefined}
                  className={`block w-full whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm ${isActive ? 'bg-teal-50 font-semibold text-teal-800' : 'text-slate-600 hover:bg-slate-50'}`}
                  onClick={() => navigate(item.id)}
                  type="button"
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
