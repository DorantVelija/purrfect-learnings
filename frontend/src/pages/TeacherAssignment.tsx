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
    submissionText: string | null; // Added
    grade: number | null;
    feedback: string | null; // Added
}

interface Assignment {
    assignmentId: number;
    assignmentName: string;
    assignmentDescription: string;
    question: string; // Added
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

    // Form states for assignment info
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [question, setQuestion] = useState("");
    const [dueDate, setDueDate] = useState("");

    // Grading states
    const [gradingUserId, setGradingUserId] = useState<number | null>(null);
    const [gradeInput, setGradeInput] = useState<number>(0);
    const [feedbackInput, setFeedbackInput] = useState("");

    useEffect(() => {
        if (!assignmentId || !id) return;
        loadData();
    }, [id, assignmentId]);

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
            setQuestion(data.question || "");
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

    const handleSaveAssignment = async () => {
        setSaving(true);
        const payload = {
            assignmentName: name,
            assignmentDescription: description,
            question: question,
            addUserIds: assignedUserIds.filter(id => !initialAssignedIds.includes(id)),
            removeUserIds: initialAssignedIds.filter(id => !assignedUserIds.includes(id))
        };

        try {
            await api.put(`/assignments/${assignmentId}`, payload);
            await loadData();
            setIsEditing(false);
            alert("Assignment updated! 🐾");
        } catch (err) {
            alert("Failed to save.");
        } finally {
            setSaving(false);
        }
    };

    const handleGradeSubmit = async () => {
        if (gradingUserId === null) return;
        try {
            await api.put(`/assignments/${assignmentId}/grade`, {
                userId: gradingUserId,
                grade: gradeInput,
                feedback: feedbackInput
            });
            alert("Grade saved! ✨");
            setGradingUserId(null);
            loadData(); // Refresh to show new grade
        } catch (err) {
            alert("Failed to save grade.");
        }
    };

    if (loading) return <div className="p-10 text-center animate-pulse text-gray-400">🐾 Loading...</div>;
    if (!assignment) return <div className="p-10 text-center">😿 Assignment not found</div>;

    return (
        <div className="space-y-8 pb-20 max-w-6xl mx-auto p-4">
            {/* Header */}
            <div className="rounded-[2.5rem] bg-gradient-to-r from-pink-100 to-indigo-100 p-10 shadow-sm">
                <div className="flex justify-between items-end">
                    <div className="flex-1">
                        <span className="px-4 py-1 text-xs font-bold rounded-full bg-white/60 text-indigo-600 uppercase">Teacher View</span>
                        {isEditing ? (
                            <input className="block w-full text-4xl font-black bg-transparent border-b-2 border-pink-300 outline-none mt-2" value={name} onChange={e => setName(e.target.value)} />
                        ) : (
                            <h1 className="text-4xl font-black text-gray-800 mt-2">{name}</h1>
                        )}
                    </div>
                    <button onClick={() => setIsEditing(!isEditing)} className="bg-white text-gray-700 px-6 py-2 rounded-full font-bold shadow-sm">
                        {isEditing ? "Cancel" : "Edit Details ✏️"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Question / Description */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 space-y-4">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Question & Instructions</h2>
                        {isEditing ? (
                            <>
                                <textarea placeholder="Question" className="w-full rounded-2xl border p-4 bg-indigo-50" value={question} onChange={e => setQuestion(e.target.value)} />
                                <textarea placeholder="Description" className="w-full rounded-2xl border p-4 bg-gray-50" value={description} onChange={e => setDescription(e.target.value)} />
                            </>
                        ) : (
                            <>
                                <p className="text-xl font-bold text-indigo-600">{question}</p>
                                <p className="text-gray-600">{description}</p>
                            </>
                        )}
                    </div>

                    {/* GRADING LIST */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Student Submissions</h2>
                        <div className="space-y-4">
                            {assignment.users.filter(u => u.submittedAt).length === 0 && (
                                <p className="text-gray-400 italic">No submissions yet... 🐈‍⬛</p>
                            )}
                            {assignment.users.filter(u => u.submittedAt).map((sub) => {
                                const studentName = courseUsers.find(c => c.id === sub.userId)?.name || "Unknown Student";
                                return (
                                    <div key={sub.userId} className="p-6 rounded-[2rem] border border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold text-gray-800">{studentName}</h3>
                                            <p className="text-xs text-green-600 font-bold uppercase">Submitted {new Date(sub.submittedAt!).toLocaleDateString()}</p>
                                            {sub.grade !== null && <span className="text-sm font-black text-indigo-500">Grade: {sub.grade}%</span>}
                                        </div>
                                        <button
                                            onClick={() => {
                                                setGradingUserId(sub.userId);
                                                setGradeInput(sub.grade || 0);
                                                setFeedbackInput(sub.feedback || "");
                                            }}
                                            className="bg-indigo-500 text-white px-5 py-2 rounded-full font-bold text-sm shadow-sm hover:bg-indigo-600 transition"
                                        >
                                            View & Grade 🔍
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* SIDEBAR: ASSIGN STUDENTS */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50">
                    <h2 className="text-sm font-black text-gray-400 uppercase mb-4">Manage Access</h2>
                    <div className="space-y-2">
                        {courseUsers.map(user => (
                            <div
                                key={user.id}
                                onClick={() => isEditing && setAssignedUserIds(prev => prev.includes(user.id) ? prev.filter(i => i !== user.id) : [...prev, user.id])}
                                className={`p-3 rounded-xl text-sm font-bold cursor-pointer transition ${assignedUserIds.includes(user.id) ? "bg-pink-100 text-pink-600" : "bg-gray-50 text-gray-400"}`}
                            >
                                {assignedUserIds.includes(user.id) ? "✅ " : "🐱 "} {user.name}
                            </div>
                        ))}
                    </div>
                    {isEditing && (
                        <button onClick={handleSaveAssignment} disabled={saving} className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-full font-bold shadow-lg">
                            {saving ? "Saving..." : "Save Changes 🚀"}
                        </button>
                    )}
                </div>
            </div>

            {/* GRADING MODAL */}
            {gradingUserId && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] max-w-2xl w-full p-10 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-black text-gray-800">Grading</h2>
                            <button onClick={() => setGradingUserId(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        <div className="p-6 bg-indigo-50 rounded-3xl">
                            <h3 className="text-xs font-black text-indigo-400 uppercase mb-2">Student Answer</h3>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {assignment.users.find(u => u.userId === gradingUserId)?.submissionText || "No text provided."}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase mb-1">Score (%)</label>
                                <input type="number" className="w-full p-4 rounded-2xl border bg-gray-50 font-bold text-xl" value={gradeInput} onChange={e => setGradeInput(Number(e.target.value))} />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase mb-1">Feedback</label>
                                <textarea className="w-full p-4 rounded-2xl border bg-gray-50 min-h-[100px]" value={feedbackInput} onChange={e => setFeedbackInput(e.target.value)} placeholder="Great job! Keep it up." />
                            </div>
                        </div>

                        <button onClick={handleGradeSubmit} className="w-full py-4 bg-gradient-to-r from-pink-400 to-indigo-400 text-white font-bold rounded-full shadow-lg hover:scale-[1.02] transition">
                            Submit Grade & Feedback ✨
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}