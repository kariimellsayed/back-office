import { Button, message, Modal, Spin, Table, Tooltip } from "antd";
import TableTitle from "./TableTitle";
import TableHeader from "./TableHeader";
import { useState } from "react";
import ActionDropdown from "./Actions/ActionDropdown";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllStudents } from "../../api/getStudents";
import dayjs from "dayjs";
import type { FilterValues } from "../../types/filterTypes";
import type { Student } from "../../types/studentType";
import type { ColumnsType } from "antd/es/table";
import { deleteStudents } from "../../api/deleteStudent";

const StudentsTable = () => {
  // Selected Rows
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // columns
  const columns: ColumnsType<Student> = [
    {
      title: "ID",
      dataIndex: "id",
      width: 100,
      key: "id",
      render: (text: string, record: Student) => (
        <div className="flex gap-5 items-center min-w-fit">
          <img
            src={record?.avatar || "/avatar.jpg"}
            loading="lazy"
            alt="avatar"
            className="min-w-10 h-10 rounded-[50%] object-cover"
          />
          <div className="flex flex-col items-center">
            <p className="font-semibold text-sm">{record?.name}</p>
            <p> #{text}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      width: 180,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
      width: 180,
    },
    {
      title: "Phone Number",
      key: "phone_num",
      align: "center",
      dataIndex: "phone_num",
      width: 180,
    },
    {
      title: "Region",
      key: "region",
      align: "center",
      dataIndex: "region",
      width: 180,
    },
    {
      title: "Course enrolled",
      key: "course_enrolled",
      align: "center",
      dataIndex: "course_enrolled",
      width: 180,
      render: (text: string[]) => {
        return text?.length > 1 ? (
          <div className="flex gap-3">
            <p>{text?.[0]}</p>
            <Tooltip title={text?.slice(1).join(", ")} color="#448FED">
              <p className="px-4 py-1 bg-blue-200 text-blue-600 rounded-[1.4rem]">
                +{text?.slice(1)?.length}
              </p>
            </Tooltip>
          </div>
        ) : (
          <p>{text?.[0] || "__"}</p>
        );
      },
    },
    {
      title: "Invite Code",
      key: "invite_code",
      align: "center",
      dataIndex: "invite_code",
      width: 180,
    },
    {
      title: "Created At",
      key: "created_at",
      dataIndex: "created_at",
      align: "center",
      width: 180,
      render: (date: string) => (
        <span className="text-gray-500 text-sm font-medium">
          {dayjs(date).format("MMM D, YYYY – h:mm A")}
        </span>
      ),
    },

    {
      title: "Actions",
      key: "Actions",
      render: (record: Student) => (
        <ActionDropdown
          student={{
            id: record.id,
            avatar: record.avatar,
            region: record.region,
            course_enrolled: record.course_enrolled,
            email: record.email,
            invite_code: record.invite_code,
            phone_num: record.phone_num,
            name: record.name,
          }}
        />
      ),

      align: "left",
    },
  ];

  const [visableCol, setVisableCol] = useState<string[]>(
    columns.map((col) => col.key as string)
  );

  const filtercolumns = columns.filter((col) =>
    visableCol.includes(col.key as string)
  );

  // Filters State
  const [filters, setFilters] = useState<FilterValues>({
    course: null,
    region: null,
    dateRange: null,
  });

  // Search
  const [search, setSearch] = useState("");

  // Students
  const { data, isLoading } = useQuery({
    queryKey: ["students", filters, search],
    queryFn: getAllStudents,
  });

  // DeleteStudent
  const queryClient = useQueryClient();

  const { mutate: deleteSelected, isPending } = useMutation({
    mutationFn: deleteStudents,
    onSuccess: () => {
      message.success("Students deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setSelectedRowKeys([]);
      setIsModalOpen(false);
    },
    onError: (error: Error) => {
      message.error(error.message || "Something went wrong");
    },
  });

  return (
    <>
      <TableTitle totalStudents={data?.length} loading={isLoading} />

      <TableHeader
        columns={columns}
        visibleColumns={visableCol}
        setVisibleColumns={setVisableCol}
        filters={filters}
        setFilters={setFilters}
        search={search}
        setSearch={setSearch}
      />

      {/* Delete Button */}
      {selectedRowKeys.length > 0 && (
        <div className="flex justify-start mb-4">
          <Button
            danger
            onClick={() => setIsModalOpen(true)}
            loading={isPending}
          >
            Delete Selected ({selectedRowKeys.length})
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="w-full h-[50vh] flex justify-center items-center">
          <Spin />
        </div>
      ) : (
        <Table
          rowKey="id"
          columns={filtercolumns}
          dataSource={data}
          pagination={{
            // pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
          }}
          rowSelection={{
            type: "checkbox",
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          className="mt-5 max-xl:overflow-x-auto"
        />
      )}

      <Modal
        title="Confirm Deletion"
        open={isModalOpen}
        onOk={() => deleteSelected(selectedRowKeys as string[])}
        confirmLoading={isPending}
        onCancel={() => setIsModalOpen(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>
          Are you sure you want to delete {selectedRowKeys.length} student(s)?
        </p>
      </Modal>
    </>
  );
};

export default StudentsTable;
