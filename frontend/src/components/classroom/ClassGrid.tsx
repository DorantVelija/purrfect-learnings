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
    "🐾",
    "📚",
    "🔬",
    "🏛️",
    "🎨",
    "🎵",
    "💻",
    "🌍"
];

export default function ClassGrid() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get<Course[]>("/course/")
            .then(res => setCourses(res.data))
            .catch(err => console.error("Failed to load courses:", err))
            .finally(() => setLoading(false));
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
            {courses.map((course, index) => (
                <ClassCard
                    key={course.id}
                    title={course.name}
                    subtitle={course.description}
                    color={courseColors[index % courseColors.length]}
                    icon={courseIcons[index % courseIcons.length]}
                    to={`/classes/${course.id}`}
                    courseId={course.id}
                />
            ))}
        </div>
    );
}