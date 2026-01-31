import { useEffect, useState } from "react";
import api from "../../lib/api";
import ClassCard from "./ClassCard";

interface Course {
    id: number;
    name: string;
    description: string;
}

const courseColors = [
    "bg-blue-100",
    "bg-pink-100",
    "bg-yellow-100",
    "bg-indigo-100",
    "bg-rose-100",
    "bg-green-100",
    "bg-purple-100",
    "bg-orange-100"
];

const courseIcons = [
    "🐾", "📚", "🔬", "🏛️", "🎨", "🎵", "💻", "🌍"
];

export default function ClassGrid() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch both the user role and the courses
                const [authRes, coursesRes] = await Promise.all([
                    api.get("/auth/me"),
                    api.get<Course[]>("/course/")
                ]);

                setUserRole(authRes.data.role);
                setCourses(coursesRes.data);
            } catch (err) {
                console.error("Failed to load dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="text-4xl mb-2">🐱</div>
                    <p className="text-gray-600">Loading your classes...</p>
                </div>
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="text-4xl mb-2">😿</div>
                    <p className="text-gray-600">No classes found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => {
                // Check if role is Teacher to set the correct route
                const isTeacher = userRole === "Teacher";
                const targetPath = isTeacher
                    ? `/teacher/classes/${course.id}`
                    : `/classes/${course.id}`;

                return (
                    <ClassCard
                        key={course.id}
                        title={course.name}
                        subtitle={course.description}
                        color={courseColors[index % courseColors.length]}
                        icon={courseIcons[index % courseIcons.length]}
                        to={targetPath}
                        courseId={course.id}
                    />
                );
            })}
        </div>
    );
}