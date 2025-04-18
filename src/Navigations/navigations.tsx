import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../Pages/User/Login";
import Home from "../Pages/Home";
import Dashboard from "../Pages/Dashboard";
import Register from "../Pages/User/Register";
import CreateModel from "../Pages/Models/CreateModel";
import ModelListView from "../Pages/Models/ModelListView";
import ModelView from "../Pages/Models/ModelView";
import MembersList from "../Pages/Members/MembersList";
import TeamList from "../Pages/Teams/TeamsList";
import RadarChartPage from "../Pages/Responses/RadarChartPage";
import SessionListView from "../Pages/Responses/SessionsListView";
import { ProtectedRoute } from "./ProtectedRoute";

const Navigations = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                <Route path="/models" element={<ProtectedRoute element={<ModelListView />} />} />
                <Route path="/models/create" element={<ProtectedRoute element={<CreateModel />} />} />
                <Route path="/models/:id" element={<ProtectedRoute element={<ModelView />} />} />
                <Route path="/teams/:id" element={<ProtectedRoute element={<MembersList />} />} />
                <Route path="/teams" element={<ProtectedRoute element={<TeamList />} />} />
                <Route path="/results" element={<ProtectedRoute element={<SessionListView />} />} />
                <Route path="/results/:modelId/:sessionId" element={<ProtectedRoute element={<RadarChartPage />} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Navigations;