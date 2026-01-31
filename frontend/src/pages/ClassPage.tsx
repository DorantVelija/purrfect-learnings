import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../lib/api";

interface Student {
    id: number;
    name: string;
}

interface Teacher {
    id: number;
    name: string;
}

interface Course {
    id: number;
    name: string;
    description: string;
    joinCode: string;
    teachers: Teacher[];
    students: Student[];
}

/* ---------- Small UI components ---------- */

function Tab({
                 label,
                 active = false,
                 onClick
             }: {
    label: string;
    active?: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`pb-3 px-2 font-medium transition ${
                active
                    ? "border-b-2 border-pink-400 text-pink-500"
                    : "text-gray-500 hover:text-pink-400"
            }`}
        >
            {label}
        </button>
    );
}

function AssignmentCard({
                            id,
                            title,
                            due,
                        }: {
    id: string;
    title: string;
    due: string;
}) {
    const navigate = useNavigate();
    const { id: courseId } = useParams();

    return (
        <div
            className="cursor-pointer bg-white rounded-2xl p-6 shadow-sm hover:shadow-md hover:scale-[1.01] transition"
            onClick={() => navigate(`/classes/${courseId}/assignments/${id}`)}
        >
            <h3 className="font-semibold text-gray-700">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">Due: {due}</p>
        </div>
    );
}

function PersonCard({ name, role }: { name: string; role: string }) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-200 to-indigo-200 flex items-center justify-center text-xl">
                {role === "Teacher" ? "👨‍🏫" : "🐱"}
            </div>
            <div>
                <h3 className="font-semibold text-gray-700">{name}</h3>
                <p className="text-sm text-gray-500">{role}</p>
            </div>
        </div>
    );
}

/* ---------- Page ---------- */

export default function ClassPage() {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<"stream" | "classwork" | "people">("stream");
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [showPostBox, setShowPostBox] = useState(false);

    useEffect(() => {
        if (!id) return;

        api.get<Course>(`/course/${id}`)
            .then(res => setCourse(res.data))
            .catch(err => console.error("Failed to load course:", err))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <div className="text-4xl mb-2">🐱</div>
                    <p className="text-gray-600">Loading class...</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <div className="text-4xl mb-2">😿</div>
                    <p className="text-gray-600">Class not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* ===== Header (illustrated style) ===== */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-[#fffaf5] p-10 shadow-sm">
                {/* blobs */}
                <div className="absolute -top-20 -left-20 w-72 h-72 bg-pink-200 rounded-full blur-[100px] opacity-60" />
                <div className="absolute top-10 -right-24 w-80 h-80 bg-blue-200 rounded-full blur-[100px] opacity-60" />
                <div className="absolute bottom-[-6rem] left-1/3 w-96 h-96 bg-yellow-100 rounded-full blur-[120px] opacity-70" />

                {/* content */}
                <div className="relative z-10">
                    <span className="inline-block mb-4 px-4 py-1 text-sm font-medium rounded-full bg-white/70 text-gray-600 shadow-sm">
                        🐾 Class
                    </span>

                    <h1 className="text-5xl font-black tracking-tight text-gray-700">
                        {course.name}
                    </h1>

                    <p className="mt-4 max-w-xl text-gray-600 leading-relaxed">
                        {course.description || `Welcome to ${course.name} — a cozy place to learn, explore, and share your pawsome ideas.`}
                    </p>

                    <div className="mt-4 inline-block px-4 py-2 rounded-full bg-white/70 text-sm font-medium text-gray-700 shadow-sm">
                        Join Code: <span className="font-bold text-pink-500">{course.joinCode}</span>
                    </div>
                </div>
            </div>

            {/* ===== Tabs ===== */}
            <div className="flex gap-8 border-b border-gray-200">
                <Tab label="Stream" active={activeTab === "stream"} onClick={() => setActiveTab("stream")} />
                <Tab label="Classwork" active={activeTab === "classwork"} onClick={() => setActiveTab("classwork")} />
                <Tab label="People" active={activeTab === "people"} onClick={() => setActiveTab("people")} />
            </div>

            {/* ===== Content ===== */}
            <div className="space-y-4">
                {activeTab === "stream" && (
                    <>
                        <div className="space-y-3">
                            <button
                                onClick={() => setShowPostBox(prev => !prev)}
                                className="rounded-full border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 transition"
                            >
                                {showPostBox ? "Cancel post" : "Create post"}
                            </button>

                            {showPostBox && (
                                <div className="flex flex-col gap-2">
                                    <input
                                        type="text"
                                        className="mt-1 w-full rounded-2xl border border-gray-200 px-5 py-3 text-gray-700 bg-gray-50"
                                        placeholder="Title"
                                    />

                                    <textarea
                                        className="mt-1 w-full rounded-2xl border border-gray-200 px-5 py-3 text-gray-700 bg-gray-50 resize-none"
                                        placeholder="Description"
                                    />

                                    <button
                                        className="self-start rounded-full bg-gradient-to-r from-pink-300 to-indigo-200 px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition"
                                    >
                                        Post
                                    </button>
                                </div>
                            )}
                        </div>

                        <AssignmentCard
                            id="1"
                            title="Homework 1"
                            due="Tomorrow"
                        />
                        <AssignmentCard
                            id="2"
                            title="Project: Cat Research"
                            due="Next week"
                        />
                    </>
                )}

                {activeTab === "classwork" && (
                    <div className="text-center py-10 text-gray-500">
                        📚 Classwork coming soon!
                    </div>
                )}

                {activeTab === "people" && (
                    <div className="space-y-6">
                        {/* Teachers */}
                        {course.teachers.length > 0 && (
                            <div>
                                <h2 className="text-lg font-bold text-gray-700 mb-4">
                                    Teachers ({course.teachers.length})
                                </h2>
                                <div className="space-y-3">
                                    {course.teachers.map(teacher => (
                                        <PersonCard
                                            key={teacher.id}
                                            name={teacher.name}
                                            role="Teacher"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Students */}
                        <div>
                            <h2 className="text-lg font-bold text-gray-700 mb-4">
                                Students ({course.students.length})
                            </h2>
                            <div className="space-y-3">
                                {course.students.map(student => (
                                    <PersonCard
                                        key={student.id}
                                        name={student.name}
                                        role="Student"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}