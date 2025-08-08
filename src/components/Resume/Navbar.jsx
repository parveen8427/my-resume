import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const supabase = useSupabaseClient();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold">
          My Resume
        </Link>
        {/* <Link to="/admin" className="text-indigo-600 hover:text-indigo-800">
          Admin
        </Link> */}
      </div>
    </nav>
  );
};

export default Navbar;
