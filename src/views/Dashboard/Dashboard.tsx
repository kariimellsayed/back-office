import StudentsTable from "../../components/Dashboard/StudentsTable";
import DashboardLayout from "../../layouts/DashboardLayout/DashboardLayout";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="min-h-screen">
        <StudentsTable />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
