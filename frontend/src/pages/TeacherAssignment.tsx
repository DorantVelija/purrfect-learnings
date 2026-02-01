import { useParams } from "react-router-dom";
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
    users: AssignmentUser[];
}

export default function TeacherAssignmentPage() {
    const { id, assignmentId } = useParams<{ id: string; assignmentId: string }>();

    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [courseUsers, setCourseUsers] = useState<CourseUser[]>([]);

    const [initialAssignedIds, setInitialAssignedIds] = useState<number[]>([]);
    const [assignedUserIds, setAssignedUserIds] = useState<number[]>([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");

    useEffect(() => {
        if (!assignmentId || !id) return;

        const loadData = async () => {
            try {
                const [assignRes, usersRes] = await Promise.all([
                    api.get<Assignment>(`/assignments/${assignmentId}`),
                    api.get<CourseUser[]>(`/Course/${id}/users`)
                ]);

                const data = assignRes.data;
                const serverIds = data.users ? data.users.map(u => u.userId) : [];

                setAssignment(data);
                setName(data.assignmentName || "");
                setDescription(data.assignmentDescription || "");
                setDueDate(data.dueDate ? new Date(data.dueDate).toISOString().slice(0, 16) : "");

                setInitialAssignedIds(serverIds);
                setAssignedUserIds(serverIds);
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

    const handleSave = async () => {
        if (!name.trim()) return alert("Assignment name cannot be empty!");
        setSaving(true);

        const payload = {
            assignmentName: name,
            assignmentDescription: description || "",
            addUserIds: assignedUserIds.filter(id => !initialAssignedIds.includes(id)),
            removeUserIds: initialAssignedIds.filter(id => !assignedUserIds.includes(id))
        };

        try {
            const response = await api.put(`/assignments/${assignmentId}`, payload);
            const updatedData = response.data;

            // Sync states with server response
            const newServerIds = updatedData.users ? updatedData.users.map((u: any) => u.userId) : [];
            setInitialAssignedIds(newServerIds);
            setAssignedUserIds(newServerIds);
            setAssignment(updatedData);

            setIsEditing(false);
            alert("Changes saved successfully! 🐾");
        } catch (err: any) {
            console.error("Save error:", err);
            alert("Failed to save changes.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center animate-pulse text-gray-400">🐾 Loading...</div>;
    if (!assignment) return <div className="p-10 text-center">😿 Assignment not found</div>;

    return (
        <div className="space-y-8 pb-20 max-w-6xl mx-auto p-4">
            {/* Header Bento Box */}
            <div className="rounded-[2.5rem] bg-gradient-to-r from-pink-100 to-indigo-100 p-10 shadow-sm relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-end">
                    <div className="space-y-2 flex-1">
                        <span className="px-4 py-1 text-xs font-bold rounded-full bg-white/60 text-indigo-600 uppercase tracking-widest">
                            Teacher Dashboard
                        </span>
                        {isEditing ? (
                            <input
                                className="block w-full text-4xl font-black text-gray-800 bg-transparent border-b-2 border-pink-300 outline-none"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        ) : (
                            <h1 className="text-4xl font-black text-gray-800 tracking-tight">{name}</h1>
                        )}
                    </div>

                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-white text-gray-700 px-6 py-2 rounded-full font-bold shadow-sm hover:shadow-md transition active:scale-95"
                        >
                            Edit ✏️
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
                                {description || "No description provided."}
                            </p>
                        )}
                    </div>

                    {/* Student Selection Grid */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Assign Students</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {courseUsers.map((user) => {
                                const isAssigned = assignedUserIds.includes(user.id);
                                return (
                                    <div
                                        key={user.id}
                                        onClick={() => toggleUserAssignment(user.id)}
                                        className={`flex items-center gap-3 p-4 rounded-2xl transition-all border-2 ${
                                            isAssigned ? "border-pink-200 bg-pink-50/30" : "border-gray-50 bg-gray-50/50"
                                        } ${isEditing ? "cursor-pointer hover:border-pink-300 active:scale-95" : "cursor-default opacity-80"}`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${isAssigned ? "bg-pink-200" : "bg-gray-200"}`}>
                                            {isAssigned ? "✅" : "🐱"}
                                        </div>
                                        <span className={`font-bold ${isAssigned ? "text-pink-600" : "text-gray-600"}`}>{user.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Due Date</label>
                        <p className="font-bold text-gray-700">{new Date(dueDate).toLocaleString()}</p>
                    </div>

                    {isEditing && (
                        <div className="space-y-3">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full rounded-full bg-gradient-to-r from-pink-400 to-indigo-400 py-4 text-white font-bold shadow-md hover:scale-[1.02] transition-all disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save Changes 🚀"}
                            </button>
                            <button
                                onClick={() => {
                                    setName(assignment.assignmentName);
                                    setDescription(assignment.assignmentDescription || "");
                                    setAssignedUserIds(initialAssignedIds);
                                    setIsEditing(false);
                                }}
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