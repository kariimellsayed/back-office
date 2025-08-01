import { Button, Checkbox, Dropdown, Input } from "antd";
import { SettingOutlined, FilterOutlined } from "@ant-design/icons";
import { useState } from "react";
import FilterStudent from "./FilterStudent";
import { CgAdd } from "react-icons/cg";
import AddStudentDrawer from "./Drawer/AddStudentDrawer";
import type { FilterValues } from "../../types/filterTypes";
import type { ColumnsType } from "antd/es/table";
import type { Student } from "../../types/studentType";

// Columns
interface TableHeaderProps {
  columns: ColumnsType<Student>;
  visibleColumns: string[];
  setVisibleColumns: (columns: string[]) => void;
  filters: FilterValues;
  setFilters: (filters: FilterValues) => void;
  search: string;
  setSearch: (search: string) => void;
}

const TableHeader = ({
  columns,
  visibleColumns,
  setVisibleColumns,
  filters,
  setFilters,
  search,
  setSearch,
}: TableHeaderProps) => {
  // Filter Open And Close
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  // Drawer State
  const [openDrawer, setOpenDrawer] = useState(false);

  // handleColumnChange
  const handleColumnChange = (checkedValues: string[]) => {
    setVisibleColumns(checkedValues);
  };

  return (
    <>
      <div className="my-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <Input
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-1/2 w-full p-2 rounded-md"
          allowClear
        />

        <div className="flex items-center gap-3">
          {/*  Columns Button */}
          <Dropdown
            trigger={["click"]}
            dropdownRender={() => (
              <div className="bg-white p-3 rounded-md shadow-md w-48">
                <Checkbox.Group
                  options={columns.map((col) => ({
                    label: col.title as string,
                    value: col.key as string,
                  }))}
                  value={visibleColumns}
                  onChange={handleColumnChange}
                  className="flex flex-col gap-2"
                />
              </div>
            )}
          >
            <Button
              icon={<SettingOutlined />}
              className="flex items-center gap-2"
            >
              Columns
            </Button>
          </Dropdown>

          {/* Filters Button */}
          <Button
            icon={<FilterOutlined />}
            className="flex items-center gap-2"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            Filters
          </Button>

          {/* Add New Student */}
          <Button
            icon={<CgAdd />}
            type="primary"
            className="px-2 md:px-6 bg-primary-500 hover:!bg-primary-600 flex items-center gap-2"
            onClick={() => setOpenDrawer(true)}
          >
            <span className="hidden md:block">Add New Student</span>
          </Button>
        </div>
      </div>

      {/*  Placeholder for Filters Component */}
      {isFiltersOpen && (
        <FilterStudent filters={filters} setFilters={setFilters} />
      )}

      {/* Add Student Drawer */}
      <AddStudentDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      />
    </>
  );
};

export default TableHeader;
