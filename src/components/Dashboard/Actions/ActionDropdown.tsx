import { Dropdown, type MenuProps, message, Modal } from "antd";
import { MoreOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import EditStudentDrawer from "../Drawer/EditStudentDrawer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStudents } from "../../../api/deleteStudent";
import type { Student } from "../../../types/studentType";

const ActionDropdown = ({ student }: { student: Student }) => {
  // Edit Drawer
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: deleteOne, isPending } = useMutation({
    mutationFn: (id: string) => deleteStudents([id]),
    onSuccess: () => {
      message.success("Student deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (error: Error) => {
      message.error(error.message || "Failed to delete student");
    },
  });

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "edit") {
      setIsEditOpen(true);
    } else if (e.key === "delete") {
      setIsDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    deleteOne(student.id);
    setIsDeleteModalOpen(false);
  };

  const handleCancel = () => {
    setIsDeleteModalOpen(false);
  };

  const items: MenuProps["items"] = [
    {
      key: "edit",
      label: (
        <span className="text-blue-500 flex items-center gap-2.5">
          <EditOutlined />
          Edit
        </span>
      ),
    },
    {
      key: "delete",
      label: (
        <span
          className="text-red-500 flex items-center gap-2.5"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          <DeleteOutlined />
          Delete
        </span>
      ),
    },
  ];

  return (
    <>
      <Dropdown menu={{ items, onClick: handleMenuClick }} trigger={["click"]}>
        <MoreOutlined style={{ fontSize: "20px", cursor: "pointer" }} />
      </Dropdown>

      {/* Edit Drawer */}
      <EditStudentDrawer
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        student={student}
      />

      {/* Delete Modal */}

      <Modal
        title="Confirm Delete"
        open={isDeleteModalOpen}
        confirmLoading={isPending}
        onOk={handleDeleteConfirm}
        onCancel={handleCancel}
        okText="Yes, Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
        // className="flex flex-col items-center text-center gap-3"
        className="custom-delete-modal"
      >
        <p>Are you sure you want to delete this student?</p>
      </Modal>
    </>
  );
};

export default ActionDropdown;
