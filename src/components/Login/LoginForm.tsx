import { Form, Input, Button, Checkbox, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useState } from "react";

interface LoginFormValues {
  email: string;
  password: string;
  remember?: boolean;
}

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    const { email, password } = values;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      message.error(error.message);
    } else {
      message.success("Logged in successfully!");
      navigate("/");
    }

    setLoading(false);
  };

  return (
    <div className="w-full flex flex-col items-center px-4">
      <h1 className="text-center text-primary-800 text-3xl md:text-4xl font-bold mb-8">
        Sign in to Your Account
      </h1>
      <Form<LoginFormValues>
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        className="w-full max-w-sm p-6 rounded-lg"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please input your Email!" },
            {
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email address!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="!text-primary-800" />}
            placeholder="Email"
            className="!py-2 !rounded-md !border"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Please input your Password!" },
            {
              pattern: /^(?=.*\d).{8,}$/,
              message:
                "Password must be at least 8 characters and include a number!",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="!text-primary-800" />}
            placeholder="Password"
            className="!py-2 !rounded-md"
          />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-between items-center text-sm">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a className="text-primary-600 hover:underline">Forgot password?</a>
          </div>
        </Form.Item>

        <Form.Item>
          <Button
            type="default"
            htmlType="submit"
            loading={loading}
            className="!bg-primary-500 hover:!bg-primary-600 !w-full !rounded-md !text-white !border-none"
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
