import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { ResumeProvider } from "./context/ResumeContext";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Login from "./components/Admin/Login";
import AdminDashboard from "./components/Admin/Dashboard";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <ResumeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </Router>
      </ResumeProvider>
    </SessionContextProvider>
  );
}

export default App;
