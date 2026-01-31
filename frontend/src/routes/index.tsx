import { Routes, Route, Navigate } from "react-router-dom";
import { type ReactNode } from "react";

import { useAuth } from "../contexts/AuthContext";

import MainLayout from "../components/layout/MainLayout";

import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Logout from "../pages/Logout";
import ClassPage from "../pages/ClassPage";
import AssignmentPage from "../pages/Assignment";
import ProfilePage from "../pages/Profile";
import BadgesPage from "../pages/Badges";
import NotFound from "../pages/errors/NotFound";

type Role = "Admin" | "Teacher" | "Student";

function RequireAuth({
                         children,
                         allowedRoles,
                     }: {
    children: ReactNode;
    allowedRoles?: Role[];
}) {
    const { user, loading } = useAuth();

    if (loading) return null;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
}

function GuestOnly({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) return null;

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
}

export default function AppRoutes() {
    return (
        <Routes>
            {/* Root */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Public - only accessible when NOT logged in */}
            <Route
                path="/login"
                element={
                    <GuestOnly>
                        <Login />
                    </GuestOnly>
                }
            />
            <Route
                path="/register"
                element={
                    <GuestOnly>
                        <Register />
                    </GuestOnly>
                }
            />
            <Route path="/logout" element={<Logout />} />

            {/* Protected */}
            <Route
                path="/dashboard"
                element={
                    <RequireAuth>
                        <MainLayout>
                            <Dashboard />
                        </MainLayout>
                    </RequireAuth>
                }
            />

            <Route
                path="/classes/:id"
                element={
                    <RequireAuth>
                        <MainLayout>
                            <ClassPage />
                        </MainLayout>
                    </RequireAuth>
                }
            />

            <Route
                path="/classes/:id/assignments/:assignmentId"
                element={
                    <RequireAuth>
                        <MainLayout>
                            <AssignmentPage />
                        </MainLayout>
                    </RequireAuth>
                }
            />

            <Route
                path="/profile"
                element={
                    <RequireAuth>
                        <MainLayout>
                            <ProfilePage />
                        </MainLayout>
                    </RequireAuth>
                }
            />

            <Route
                path="/badges"
                element={
                    <RequireAuth>
                        <MainLayout>
                            <BadgesPage />
                        </MainLayout>
                    </RequireAuth>
                }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}