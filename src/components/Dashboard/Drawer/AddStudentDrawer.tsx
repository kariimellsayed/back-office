import { Drawer, Form, Input, Select, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState, type FC } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { AddStudent } from "../../../api/addStudent";
// import { getAllStudents } from "../../../api/getStudents";
import type { Student } from "../../../types/studentType";
import type { UploadFile } from "antd";
import { useQueryClient } from "@tanstack/react-query";

interface StudentDrawerProps {
  open: boolean;
  onClose: () => void;
}

const { Option } = Select;

const AddStudentDrawer: FC<StudentDrawerProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  // Loading
  const [loading, setLoading] = useState(false);
  // Query
  const queryClient = useQueryClient();

  // Regions
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

  // Courses
  const courses = [
    "Frontend Development",
    "Backend Development",
    "Fullstack",
    "UI/UX Design",
    "Cybersecurity",
    "Data Science",
  ];

  // Handle Image
  const uploadImageToSupabase = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from("students")
      .upload(filePath, file);

    if (error) throw error;

    // Image Url
    const { data } = supabase.storage.from("students").getPublicUrl(filePath);

    return data.publicUrl;
  };

  // Form Types
  type AddStudentFormValues = Omit<Student, "avatar"> & {
    avatar?: UploadFile[];
  };

  const handleFinish = async (values: AddStudentFormValues) => {
    setLoading(true);
    try {
      let imageUrl: string | null = null;

      const fileList = values.avatar;
      const file = fileList?.[0]?.originFileObj;

      if (file) {
        imageUrl = await uploadImageToSupabase(file);
      }

      const studentData: Student = {
        // id: values.id,
        name: values.name,
        region: values.region,
        course_enrolled: values.course_enrolled,
        email: values.email,
        invite_code: values.invite_code || null,
        avatar: imageUrl || "", // أو null لو في النوع الأصلي
        phone_num: values.phone_num,
      };

      await AddStudent({ body: studentData });

      form.resetFields();
      onClose();
      // Success
      message.success("Student added successfully!");
      // Refresh All Students
      queryClient.invalidateQueries({ queryKey: ["students"] });
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : "Something went wrong";
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Drawer
      title="Add New Student"
      placement="right"
      width={400}
      onClose={onClose}
      open={open}
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        {/* Upload Avatar */}
        <Form.Item
          label="Student Avatar"
          name="avatar"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e?.fileList;
          }}
        >
          <Upload
            name="file"
            listType="picture"
            maxCount={1}
            beforeUpload={() => false} // لازم علشان نتحكم في الرفع بنفسنا
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Form.Item>

        {/* Full Name */}
        <Form.Item
          label="Full Name"
          name="name"
          rules={[{ required: true, message: "Please enter student name" }]}
        >
          <Input placeholder="Enter student name" />
        </Form.Item>

        {/* Region */}
        <Form.Item
          label="Region"
          name="region"
          rules={[{ required: true, message: "Please select a region" }]}
        >
          <Select placeholder="Select a region">
            {regions.map((region) => (
              <Option key={region} value={region}>
                {region}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Course Enrolled */}
        <Form.Item
          label="Course Enrolled"
          name="course_enrolled"
          rules={[{ required: true, message: "Please select a course" }]}
        >
          <Select mode="multiple" placeholder="Select course">
            {courses.map((course) => (
              <Option key={course} value={course}>
                {course}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Email */}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>
        {/* Phone Number */}
        <Form.Item
          label="Phone Number"
          name="phone_num"
          rules={[
            { required: true, message: "Please enter phone number" },
            {
              pattern: /^[0-9]{11}$/,
              message: "Phone number must be exactly 11 digits",
            },
          ]}
        >
          <Input maxLength={11} placeholder="Enter phone number" />
        </Form.Item>

        {/* Invite Code */}
        <Form.Item label="Invite Code" name="invite_code">
          <Input placeholder="Enter invite code (optional)" />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Add Student
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddStudentDrawer;
