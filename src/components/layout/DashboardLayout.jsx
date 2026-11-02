import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="md:flex">
        <Sidebar />
        <main className="min-w-0 flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
