import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../lib/api";

interface CourseUser {
    id: number;
    name: string;
    role: string;
}

interface AssignmentUser {
    assignmentId: number;
    userId: number;
    submittedAt: string | null;
    grade: number | null;
}

interface Assignment {
    assignmentId: number;
    assignmentName: string;
    assignmentDescription: string;
    courseId: number;
    dueDate: string;
    isClosed?: boolean;
    users: AssignmentUser[];
}

export default function TeacherAssignmentPage() {
    const { id, assignmentId } = useParams<{ id: string; assignmentId: string }>();
    const navigate = useNavigate();

    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [courseUsers, setCourseUsers] = useState<CourseUser[]>([]);
    const [assignedUserIds, setAssignedUserIds] = useState<number[]>([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Form States
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [isClosed, setIsClosed] = useState(false);

    useEffect(() => {
        if (!assignmentId || !id) return;

        const loadData = async () => {
            try {
                const [assignRes, usersRes] = await Promise.all([
                    api.get<Assignment>(`/assignments/${assignmentId}`),
                    api.get<CourseUser[]>(`/Course/${id}/users`)
                ]);

                setAssignment(assignRes.data);
                setName(assignRes.data.assignmentName);
                setDescription(assignRes.data.assignmentDescription);
                setDueDate(new Date(assignRes.data.dueDate).toISOString().slice(0, 16));
                setIsClosed(assignRes.data.isClosed || false);
                setAssignedUserIds(assignRes.data.users.map(u => u.userId));
                setCourseUsers(usersRes.data.filter(u => u.role === "Student"));
            } catch (err) {
                console.error("Failed to load data:", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id, assignmentId]);

    const toggleUserAssignment = (userId: number) => {
        if (!isEditing) return;
        setAssignedUserIds(prev =>
            prev.includes(userId) ? prev.filter(uid => uid !== userId) : [...prev, userId]
        );
    };

    const handleSelectAll = () => {
        if (assignedUserIds.length === courseUsers.length) {
            setAssignedUserIds([]);
        } else {
            setAssignedUserIds(courseUsers.map(u => u.id));
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put(`/assignments/${assignmentId}`, {
                assignmentName: name,
                assignmentDescription: description,
                dueDate: new Date(dueDate).toISOString(),
                isClosed: isClosed,
                assignedUserIds: assignedUserIds
            });
            // Refresh local assignment state
            setAssignment({
                ...assignment!,
                assignmentName: name,
                assignmentDescription: description,
                dueDate: new Date(dueDate).toISOString(),
                isClosed: isClosed
            });
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            alert("Failed to save changes.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center animate-pulse text-gray-400">🐾 Loading assignment details...</div>;
    if (!assignment) return <div className="p-10 text-center">😿 Assignment not found</div>;

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="rounded-[2.5rem] bg-gradient-to-r from-pink-100 to-indigo-100 p-10 shadow-sm relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-end">
                    <div className="space-y-2 flex-1">
                        <span className="px-4 py-1 text-xs font-bold rounded-full bg-white/60 text-indigo-600 uppercase tracking-widest">
                            Teacher View
                        </span>
                        {isEditing ? (
                            <input
                                className="block w-full text-4xl font-black text-gray-800 bg-transparent border-b-2 border-pink-300 outline-none"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoFocus
                            />
                        ) : (
                            <h1 className="text-4xl font-black text-gray-800 tracking-tight">{assignment.assignmentName}</h1>
                        )}
                        <p className="text-gray-500 font-medium">Assignment ID: {assignmentId}</p>
                    </div>

                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-white text-gray-700 px-6 py-2 rounded-full font-bold shadow-sm hover:shadow-md transition active:scale-95"
                        >
                            Edit Assignment ✏️
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Description Section */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 space-y-4">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Description</h2>
                        {isEditing ? (
                            <textarea
                                className="w-full rounded-2xl border border-gray-100 px-5 py-4 text-gray-700 bg-gray-50 focus:ring-2 focus:ring-pink-200 outline-none transition-all min-h-[120px] resize-none"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        ) : (
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                                {assignment.assignmentDescription || "No description provided."}
                            </p>
                        )}
                    </div>

                    {/* Student Management List */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Assign Students</h2>
                                <p className="text-sm text-gray-500">{assignedUserIds.length} of {courseUsers.length} students assigned</p>
                            </div>
                            {isEditing && (
                                <button
                                    onClick={handleSelectAll}
                                    className="text-sm font-bold text-indigo-500 hover:text-indigo-700 transition"
                                >
                                    {assignedUserIds.length === courseUsers.length ? "Deselect All" : "Select All Students"}
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {courseUsers.map((user) => {
                                const isAssigned = assignedUserIds.includes(user.id);
                                return (
                                    <div
                                        key={user.id}
                                        onClick={() => toggleUserAssignment(user.id)}
                                        className={`flex items-center justify-between p-4 rounded-2xl transition-all border-2 ${
                                            isAssigned
                                                ? "border-pink-200 bg-pink-50/30"
                                                : "border-gray-50 bg-gray-50/50"
                                        } ${isEditing ? "cursor-pointer hover:border-pink-300" : "cursor-default opacity-80"}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${isAssigned ? "bg-pink-200" : "bg-gray-200"}`}>
                                                {isAssigned ? "✅" : "🐱"}
                                            </div>
                                            <span className={`font-bold ${isAssigned ? "text-pink-600" : "text-gray-600"}`}>
                                                {user.name}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Sidebar Stats & Controls */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50 space-y-6">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Due Date</label>
                            {isEditing ? (
                                <input
                                    type="datetime-local"
                                    className="w-full rounded-2xl border border-gray-100 px-4 py-2 text-gray-700 bg-gray-50 outline-none focus:ring-2 focus:ring-pink-200"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                />
                            ) : (
                                <p className="font-bold text-gray-700">{new Date(assignment.dueDate).toLocaleString()}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Submissions</label>
                            {isEditing ? (
                                <button
                                    onClick={() => setIsClosed(!isClosed)}
                                    className={`w-full rounded-xl px-4 py-2 font-bold border transition-all ${
                                        isClosed ? "bg-red-50 text-red-500 border-red-100" : "bg-green-50 text-green-600 border-green-100"
                                    }`}
                                >
                                    {isClosed ? "Locked 🔒" : "Accepting 🔓"}
                                </button>
                            ) : (
                                <span className={`font-bold ${assignment.isClosed ? "text-red-500" : "text-green-500"}`}>
                                    {assignment.isClosed ? "Closed for submissions" : "Actively accepting work"}
                                </span>
                            )}
                        </div>
                    </div>

                    {isEditing && (
                        <div className="space-y-3">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full rounded-full bg-gradient-to-r from-pink-400 to-indigo-400 py-4 text-white font-bold shadow-md hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                            >
                                {saving ? "Saving Changes..." : "Save Changes 🚀"}
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="w-full rounded-full bg-gray-100 py-3 text-gray-600 font-bold hover:bg-gray-200 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}