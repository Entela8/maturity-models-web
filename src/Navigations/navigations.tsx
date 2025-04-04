import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../Pages/Login";
import Home from "../Pages/Home";
import { ProtectedRoute } from "./ProtectedRoute";
import Description from "../Pages/Description";
import Dashboard from "../Pages/Dashboard";
import Register from "../Pages/Register";
import CreatForm from "../Pages/CreatForm";
import FormListView from "../Pages/FromListView";

const Navigations = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/des" element={<Description />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/createForm" element={<CreatForm />} />
                <Route path="/formList" element={<FormListView />} />


            </Routes>
        </BrowserRouter>
    );
}

export default Navigations;