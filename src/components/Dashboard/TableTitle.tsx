import { Spin } from "antd";

interface titleProps {
  totalStudents: number | undefined;
  loading: boolean;
}

const TableTitle = ({ totalStudents, loading }: titleProps) => {
  return (
    <div className="flex gap-10 items-center">
      <p className="text-xl md:text-2xl font-semibold">Students Table</p>
      <p
        className="text-sm shadow-lg py-2 px-6 text-violet-700 font-semibold border border-violet-700
       rounded-full bg-violet-100 flex items-center gap-2"
      >
        {loading ? (
          <Spin size="small" style={{ color: "white" }} />
        ) : (
          <span>{totalStudents}</span>
        )}
        Students
      </p>
    </div>
  );
};

export default TableTitle;
