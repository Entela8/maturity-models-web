import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../Pages/Login";
import Home from "../Pages/Home";
import { ProtectedRoute } from "./ProtectedRoute";

const Navigations = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute element={<Home />} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Navigations;