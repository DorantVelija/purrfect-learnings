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

interface Assignment {
    assignmentId: number;
    assignmentName: string;
    assignmentDescription: string;
    question: string;
    courseId: number;
    dueDate: string;
}

/* ---------- UI Components ---------- */

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
            className="cursor-pointer bg-white rounded-2xl p-6 shadow-sm hover:shadow-md hover:scale-[1.01] transition border border-gray-50"
            onClick={() => navigate(`/teacher/classes/${courseId}/assignment/${id}`)}
        >
            <h3 className="font-semibold text-gray-700">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">Due: {due}</p>
        </div>
    );
}

function PersonCard({
                        id,
                        name,
                        role,
                        onKick,
                        onBan
                    }: {
    id: number;
    name: string;
    role: string;
    onKick?: (id: number) => void;
    onBan?: (id: number) => void;
}) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-between gap-4 group transition hover:shadow-md border border-transparent hover:border-pink-50">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-200 to-indigo-200 flex items-center justify-center text-xl">
                    {role === "Teacher" ? "👨‍🏫" : "🐱"}
                </div>
                <div>
                    <h3 className="font-semibold text-gray-700">{name}</h3>
                    <p className="text-sm text-gray-500">{role}</p>
                </div>
            </div>

            {/* Admin Actions for Students */}
            {role === "Student" && (
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onKick?.(id)}
                        className="px-4 py-2 text-xs font-bold text-orange-600 bg-orange-50 rounded-full hover:bg-orange-100 transition active:scale-95"
                    >
                        Kick 🦶
                    </button>
                    <button
                        onClick={() => onBan?.(id)}
                        className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition active:scale-95"
                    >
                        Ban 🚫
                    </button>
                </div>
            )}
        </div>
    );
}

/* ---------- Main Page ---------- */

export default function TeacherClassPage() {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<"stream" | "classwork" | "people" | "settings">("stream");
    const [course, setCourse] = useState<Course | null>(null);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);

    const [showAssignmentBox, setShowAssignmentBox] = useState(false);

    // Assignment Form States
    const [assignmentTitle, setAssignmentTitle] = useState("");
    const [assignmentDescription, setAssignmentDescription] = useState("");
    const [assignmentQuestion, setAssignmentQuestion] = useState("");
    const [assignmentDueDate, setAssignmentDueDate] = useState("");

    useEffect(() => {
        if (!id) return;
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const [courseRes, assignRes] = await Promise.all([
                api.get<Course>(`/course/${id}`),
                api.get<Assignment[]>(`/assignments/course/${id}`)
            ]);
            setCourse(courseRes.data);
            setAssignments(assignRes.data);
        } catch (err) {
            console.error("Failed to load data:", err);
        } finally {
            setLoading(false);
        }
    };

    const createAssignment = async () => {
        if (!id) return;
        if (!assignmentTitle.trim() || !assignmentQuestion.trim()) {
            return alert("Title and Question are required! 🐾");
        }

        try {
            const res = await api.post<Assignment>(`/assignments`, {
                assignmentName: assignmentTitle,
                assignmentDescription: assignmentDescription,
                question: assignmentQuestion,
                courseId: Number(id),
                dueDate: new Date(assignmentDueDate).toISOString(),
            });

            setAssignments(prev => [res.data, ...prev]);
            setAssignmentTitle("");
            setAssignmentDescription("");
            setAssignmentQuestion("");
            setAssignmentDueDate("");
            setShowAssignmentBox(false);
            alert("Assignment posted! 🚀");
        } catch (err) {
            console.error("Failed to create assignment:", err);
            alert("Check console. Make sure database migrations are updated.");
        }
    };

    const handleKick = async (studentId: number) => {
        if (!window.confirm("Kick this student? They can rejoin with the code. 🦶")) return;
        try {
            await api.delete(`/course/${id}/kick/${studentId}`);
            loadData();
            alert("Student removed from class.");
        } catch (err) {
            alert("Failed to kick student.");
        }
    };

    const handleBan = async (studentId: number) => {
        if (!window.confirm("BAN this student? They won't be able to rejoin! 🚫")) return;
        try {
            await api.post(`/course/${id}/ban/${studentId}`);
            loadData();
            alert("Student banned.");
        } catch (err) {
            alert("Failed to ban student.");
        }
    };

    if (loading) return <div className="p-10 text-center animate-pulse">🐾 Loading class...</div>;
    if (!course) return <div className="p-10 text-center">😿 Class not found</div>;

    return (
        <div className="space-y-10 max-w-6xl mx-auto p-4">
            {/* Header */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-[#fffaf5] p-10 shadow-sm border border-orange-50">
                <div className="relative z-10">
                    <span className="inline-block mb-4 px-4 py-1 text-sm font-medium rounded-full bg-white/70 text-gray-600 shadow-sm">🐾 Class</span>
                    <h1 className="text-5xl font-black tracking-tight text-gray-700">{course.name}</h1>
                    <p className="mt-4 max-w-xl text-gray-600 leading-relaxed">{course.description || "Welcome to class!"}</p>
                    <div className="mt-4 inline-block px-4 py-2 rounded-full bg-white/70 text-sm font-medium text-gray-700 shadow-sm">
                        Join Code: <span className="font-bold text-pink-500">{course.joinCode}</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-gray-200">
                <Tab label="Stream" active={activeTab === "stream"} onClick={() => setActiveTab("stream")} />
                <Tab label="Classwork" active={activeTab === "classwork"} onClick={() => setActiveTab("classwork")} />
                <Tab label="People" active={activeTab === "people"} onClick={() => setActiveTab("people")} />
                <Tab label="Settings" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
            </div>

            <div className="space-y-4">
                {activeTab === "stream" && (
                    <div className="space-y-4">
                        {assignments.map(asgn => (
                            <AssignmentCard
                                key={asgn.assignmentId}
                                id={asgn.assignmentId.toString()}
                                title={asgn.assignmentName}
                                due={new Date(asgn.dueDate).toLocaleDateString()}
                            />
                        ))}
                    </div>
                )}

                {activeTab === "classwork" && (
                    <div className="space-y-6">
                        <button
                            onClick={() => setShowAssignmentBox(!showAssignmentBox)}
                            className="rounded-full border border-gray-200 px-6 py-3 text-sm font-bold text-gray-600 bg-white hover:bg-gray-50 transition shadow-sm"
                        >
                            {showAssignmentBox ? "Cancel" : "➕ Create Assignment"}
                        </button>

                        {showAssignmentBox && (
                            <div className="flex flex-col gap-3 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                                <input
                                    type="text"
                                    value={assignmentTitle}
                                    onChange={e => setAssignmentTitle(e.target.value)}
                                    className="w-full rounded-2xl border border-gray-100 px-5 py-3 bg-gray-50 outline-none"
                                    placeholder="Assignment Title"
                                />
                                <textarea
                                    value={assignmentQuestion}
                                    onChange={e => setAssignmentQuestion(e.target.value)}
                                    className="w-full rounded-2xl border border-indigo-100 px-5 py-4 bg-indigo-50 outline-none transition"
                                    placeholder="The Prompt (Question)"
                                    rows={3}
                                />
                                <textarea
                                    value={assignmentDescription}
                                    onChange={e => setAssignmentDescription(e.target.value)}
                                    className="w-full rounded-2xl border border-gray-100 px-5 py-3 bg-gray-50 outline-none"
                                    placeholder="Extra Instructions"
                                    rows={2}
                                />
                                <input
                                    type="date"
                                    value={assignmentDueDate}
                                    onChange={e => setAssignmentDueDate(e.target.value)}
                                    className="w-full rounded-2xl border border-gray-100 px-5 py-3 bg-gray-50"
                                />
                                <button
                                    onClick={createAssignment}
                                    className="self-end rounded-full bg-gradient-to-r from-pink-400 to-indigo-400 px-8 py-3 text-white font-bold shadow-md hover:scale-[1.02] transition"
                                >
                                    Post Assignment 🚀
                                </button>
                            </div>
                        )}

                        <div className="space-y-4">
                            {assignments.map(asgn => (
                                <AssignmentCard
                                    key={asgn.assignmentId}
                                    id={asgn.assignmentId.toString()}
                                    title={asgn.assignmentName}
                                    due={new Date(asgn.dueDate).toLocaleDateString()}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "people" && (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-lg font-bold text-gray-700 mb-4 ml-2">Teachers ({course.teachers.length})</h2>
                            <div className="space-y-3">
                                {course.teachers.map(t => (
                                    <PersonCard key={t.id} id={t.id} name={t.name} role="Teacher" />
                                ))}
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-700 mb-4 ml-2">Students ({course.students.length})</h2>
                            <div className="space-y-3">
                                {course.students.map(s => (
                                    <PersonCard
                                        key={s.id}
                                        id={s.id}
                                        name={s.name}
                                        role="Student"
                                        onKick={handleKick}
                                        onBan={handleBan}
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