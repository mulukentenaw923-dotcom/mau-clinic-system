export default function SearchBar({ onSearch, value = '' }) {
  return (
    <label className="block">
      <span className="sr-only">Search patients</span>
      <input
        className="w-full rounded-lg border border-slate-300 px-4 py-2"
        onChange={(event) => onSearch?.(event.target.value)}
        placeholder="Search patients"
        type="search"
        value={value}
      />
    </label>
  );
}
