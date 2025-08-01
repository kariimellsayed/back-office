import { Layout, Menu, Button } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { message } from "antd";

const { Header, Sider, Content } = Layout;

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    message.success("Logged out");
    navigate("/login");
  };

  return (
    <Layout className="min-h-screen">
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        breakpoint="lg" //
        collapsedWidth={60} //
        className="bg-primary-500"
      >
        {/* Dashboard Logo */}
        <div className="h-16 flex items-center justify-center text-white text-xl font-bold">
          {collapsed ? (
            "BO"
          ) : (
            <img
              src="/student.png"
              className="w-10 h-10 filter invert brightness-0"
            />
          )}
        </div>

        {/* Sidebar Menu - Only Users Page */}
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: "Students",
              onClick: () => navigate("/"),
            },
          ]}
        />
      </Sider>

      {/* Main Content */}
      <Layout>
        {/* Header */}
        <Header className="flex justify-between items-center px-4 shadow bg-primary-500">
          {/* Toggle Sidebar Button */}
          <Button
            type="text"
            icon={
              collapsed ? (
                <MenuUnfoldOutlined className="!text-white" />
              ) : (
                <MenuFoldOutlined className="!text-white" />
              )
            }
            onClick={() => setCollapsed(!collapsed)}
            className="text-lg"
          />

          {/* Logout Button */}
          <Button
            type="primary"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className="!bg-white !text-primary-500 hover:!bg-gray-100 !font-semibold"
          >
            Logout
          </Button>
        </Header>

        {/* Page Content */}
        <Content className="m-4 p-4 bg-white rounded-md shadow min-h-screen">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
