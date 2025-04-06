import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../Pages/User/Login";
import Home from "../Pages/Home";
import { ProtectedRoute } from "./ProtectedRoute";
import Dashboard from "../Pages/Dashboard";
import Register from "../Pages/User/Register";
import CreateModel from "../Pages/Models/CreateModel";
import ModelListView from "../Pages/Models/ModelListView";
import ModelView from "../Pages/Models/ModelView";


const Navigations = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/models" element={<ModelListView />} />
                <Route path="/models/create" element={<CreateModel />} />
                <Route path="/models/:id" element={<ModelView />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Navigations;