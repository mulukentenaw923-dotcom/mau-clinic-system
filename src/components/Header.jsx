import { LogOut, User } from 'lucide-react';

export default function DashboardHeader({ title, userRole, userName, onLogout }) {
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="flex min-h-[68px] items-center justify-between gap-4 border-b border-gray-200 bg-white px-6 py-4">
      <div aria-label={`Clinic / ${title}`} className="flex min-w-0 items-center gap-2 text-sm text-gray-500">
        <span>Clinic</span>
        <span aria-hidden="true">/</span>
        <span className="truncate font-semibold text-gray-800">{title}</span>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <span className="hidden text-xs font-medium text-gray-500 sm:inline">
          {formattedDate}
        </span>

        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-[#004d40]">
            {userName
              ? userName.trim().charAt(0).toUpperCase()
              : <User aria-hidden="true" className="h-4 w-4" />}
          </div>
          <div className="text-left">
            <p className="max-w-28 truncate text-xs font-bold text-gray-800">{userName || 'User'}</p>
            <p className="text-[10px] font-semibold uppercase text-emerald-700">{userRole || 'User'}</p>
          </div>
        </div>

        <button
          aria-label="Log out"
          className="flex min-h-9 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004d40]"
          onClick={onLogout}
          type="button"
        >
          <LogOut aria-hidden="true" className="h-4 w-4" />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>
    </header>
  );
}
