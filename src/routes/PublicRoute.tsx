import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState, type ReactNode } from "react";
import { Spin } from "antd";

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkSession = async () => {
    const { data } = await supabase.auth.getSession();
    setIsLoggedIn(!!data.session);
    setLoading(false);
  };

  useEffect(() => {
    checkSession();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (isLoggedIn) return <Navigate to="/" />;

  return <>{children}</>;
};

export default PublicRoute;
