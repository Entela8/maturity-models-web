import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../Pages/Login";
import Home from "../Pages/Home";
import { ProtectedRoute } from "./ProtectedRoute";
import Signup from "../Pages/Signup";
import Description from "../Pages/Description";
import Dashboard from "../Pages/Dashboard";

const Navigations = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Signup />} />
                <Route path="/des" element={<Description />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Navigations;