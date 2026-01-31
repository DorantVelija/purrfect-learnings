import { Routes, Route, Navigate } from "react-router-dom";
import { type ReactNode } from "react";

import { useAuth } from "../contexts/AuthContext";

import MainLayout from "../components/layout/MainLayout";
import TeacherLayout from "../components/layout/TeacherLayout";

import Dashboard from "../pages/Dashboard";
import TeacherDashboard from "../pages/TeacherDashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Logout from "../pages/Logout";
import ClassPage from "../pages/ClassPage";
import AssignmentPage from "../pages/Assignment";
import ProfilePage from "../pages/Profile";
import BadgesPage from "../pages/Badges";
import NotFound from "../pages/errors/NotFound";
import CreateClass from "../pages/CreateClass";

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

    if (allowedRoles && !allowedRoles.includes(user.role as Role)) {
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

// Helper component to pick layout based on role
function ConditionalLayout({ children }: { children: ReactNode }) {
    const { user } = useAuth();

    if (user?.role === "Teacher") {
        return <TeacherLayout>{children}</TeacherLayout>;
    }

    return <MainLayout>{children}</MainLayout>;
}

// Conditional Dashboard - picks layout and component based on role
function ConditionalDashboard() {
    const { user } = useAuth();

    if (user?.role === "Teacher") {
        return (
            <TeacherLayout>
                <TeacherDashboard />
            </TeacherLayout>
        );
    }

    // Student or Admin
    return (
        <MainLayout>
            <Dashboard />
        </MainLayout>
    );
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

            {/* Dashboard - conditional based on role */}
            <Route
                path="/dashboard"
                element={
                    <RequireAuth>
                        <ConditionalDashboard />
                    </RequireAuth>
                }
            />

            {/* Create Class - Teacher only */}
            <Route
                path="/create-class"
                element={
                    <RequireAuth allowedRoles={["Teacher"]}>
                        <TeacherLayout>
                            <CreateClass />
                        </TeacherLayout>
                    </RequireAuth>
                }
            />

            {/* Protected Routes - use conditional layout */}
            <Route
                path="/classes/:id"
                element={
                    <RequireAuth>
                        <ConditionalLayout>
                            <ClassPage />
                        </ConditionalLayout>
                    </RequireAuth>
                }
            />

            <Route
                path="/classes/:id/assignments/:assignmentId"
                element={
                    <RequireAuth>
                        <ConditionalLayout>
                            <AssignmentPage />
                        </ConditionalLayout>
                    </RequireAuth>
                }
            />

            <Route
                path="/profile"
                element={
                    <RequireAuth>
                        <ConditionalLayout>
                            <ProfilePage />
                        </ConditionalLayout>
                    </RequireAuth>
                }
            />

            <Route
                path="/badges"
                element={
                    <RequireAuth>
                        <ConditionalLayout>
                            <BadgesPage />
                        </ConditionalLayout>
                    </RequireAuth>
                }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}