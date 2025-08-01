const LoginImage = () => {
  return (
    <div className="w-full md:w-1/2 h-60 md:h-screen bg-[rgb(235,235,255)] flex justify-center items-center p-6">
      <div className="text-center">
        {/* <h1 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4">
          Back | Office
        </h1> */}
        <img
          src="/student.png"
          alt="Login illustration"
          className="max-w-xs md:max-w-sm w-full mt-10"
        />
      </div>
    </div>
  );
};

export default LoginImage;
