import { RiUserSearchFill } from "react-icons/ri";

interface ISearchSort {
  sort: "A-Z" | "Z-A";
  search: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setSort: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SearchSort: React.FC<ISearchSort> = ({
  sort,
  search,
  handleSearchChange,
  setSort,
}) => {
  return (
    <div className="flex flex-col sm:flex-row  justify-between items-center mb-6 gap-4">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <label htmlFor="sort" className="text-white font-medium">
          Sort name by:
        </label>
        <select
          id="sort"
          value={sort}
          onChange={setSort}
          className="bg-[#1E293B] text-white border border-gray-600 rounded-md px-4 py-1 outline-none"
        >
          <option value="A-Z">A-Z</option>
          <option value="Z-A">Z-A</option>
        </select>
      </div>
      <div className="flex items-center bg-[#1E293B] px-2 p-0.5 rounded-2xl">
        <RiUserSearchFill className="text-white" />
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search users..."
          className="bg-[#1E293B] text-white rounded-md px-4 py-1.5 text-sm w-full sm:w-64 outline-none"
        />
      </div>
    </div>
  );
};

export default SearchSort;
