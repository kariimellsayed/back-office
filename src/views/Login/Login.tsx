import LoginForm from "../../components/Login/LoginForm";
import LoginImage from "../../components/Login/LoginImage";

const Login = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Image */}
      <LoginImage />

      {/* Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
