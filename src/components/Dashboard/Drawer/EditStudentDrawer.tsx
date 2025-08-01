import { Drawer, Form, Input, Select, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { FC } from "react";
import type { Student } from "../../../types/studentType";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editStudent } from "../../../api/editStudent";
import { supabase } from "../../../lib/supabaseClient";
import type { UploadFile } from "antd/es/upload/interface";

interface EditStudentDrawerProps {
  open: boolean;
  onClose: () => void;
  student: Student;
}

const regions = [
  "Cairo",
  "Alexandria",
  "Giza",
  "Dakahlia",
  "Sharqia",
  "Qalyubia",
  "Asyut",
  "Suez",
  "Minya",
];

const courses = [
  "Frontend Development",
  "Backend Development",
  "Fullstack",
  "UI/UX Design",
  "Cybersecurity",
  "Data Science",
];

const EditStudentDrawer: FC<EditStudentDrawerProps> = ({
  open,
  onClose,
  student,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const queryClient = useQueryClient();

  // Update Supabase
  const uploadImageToSupabase = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;
    const { error } = await supabase.storage
      .from("students")
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage.from("students").getPublicUrl(filePath);

    return data.publicUrl;
  };

  const { mutate: updateStudent, isPending } = useMutation({
    mutationFn: (data: Student) =>
      editStudent({ id: student.id, dataEdit: data }),
    onSuccess: () => {
      message.success("Student updated successfully");
      queryClient.invalidateQueries({ queryKey: ["students"] });
      onClose();
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });

  const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  const onFinish = async (values: Student) => {
    let avatarUrl = student.avatar;

    const file = fileList?.[0]?.originFileObj as File | undefined;

    if (file) {
      avatarUrl = await uploadImageToSupabase(file);
    }

    const finalData: Student = {
      ...values,
      id: student.id,
      avatar: avatarUrl || "", // خليها "" لو مفيش
    };

    updateStudent(finalData);
  };

  useEffect(() => {
    if (student?.avatar) {
      setFileList([
        {
          uid: "-1",
          name: "avatar.png",
          status: "done",
          url: student.avatar,
        },
      ]);
    }
    form.setFieldsValue({
      name: student.name,
      email: student.email,
      phone_num: student.phone_num,
      region: student.region,
      course_enrolled: student.course_enrolled,
      invite_code: student.invite_code || "",
    });
  }, [student, form]);

  return (
    <Drawer
      title="Edit Student"
      placement="right"
      width={400}
      onClose={onClose}
      open={open}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input type="email" />
        </Form.Item>

        <Form.Item
          name="phone_num"
          label="Phone Number"
          rules={[
            { required: true },
            {
              pattern: /^[0-9]{11}$/,
              message: "Phone number must be 11 digits",
            },
          ]}
        >
          <Input maxLength={11} />
        </Form.Item>

        <Form.Item name="region" label="Region" rules={[{ required: true }]}>
          <Select placeholder="Select a region">
            {regions.map((region) => (
              <Select.Option key={region} value={region}>
                {region}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="course_enrolled"
          label="Courses Enrolled"
          rules={[{ required: true }]}
        >
          <Select mode="multiple" placeholder="Select courses">
            {courses.map((course) => (
              <Select.Option key={course} value={course}>
                {course}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="invite_code" label="Invite Code">
          <Input />
        </Form.Item>

        <Form.Item label="Avatar">
          <Upload
            listType="picture"
            fileList={fileList}
            maxCount={1}
            onChange={handleUploadChange}
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />}>Upload Avatar</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={isPending}>
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default EditStudentDrawer;
