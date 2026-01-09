import { Routes, Route } from "react-router-dom";
// import Home from "../pages/Home";
// import Login from "../pages/Login";
// import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/errors/NotFound.tsx";

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<NotFound />} />
            <Route path="/login" element={<NotFound />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<NotFound />} />

            {/* Catch All */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
