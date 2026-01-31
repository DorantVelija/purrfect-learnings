import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../lib/api";

interface AssignmentUser {
    assignmentId: number;
    userId: number;
    assignedAt: string;
    submittedAt: string | null;
    grade: number | null;
}

interface Assignment {
    assignmentId: number;
    assignmentName: string;
    assignmentDescription: string;
    courseId: number;
    created: string;
    updated: string;
    dueDate: string;
    users: AssignmentUser[];
}

export default function AssignmentPage() {
    const { id, assignmentId } = useParams<{
        id: string;
        assignmentId: string;
    }>();

    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!assignmentId) return;

        api.get<Assignment>(`/assignments/${assignmentId}`)
            .then((res) => setAssignment(res.data))
            .catch((err) => console.error("Failed to load assignment:", err))
            .finally(() => setLoading(false));
    }, [assignmentId]);

    const handleLevelSubmit = async () => {
        if (!assignmentId || submitting) return;
        setSubmitting(true);
        try {
            // Adjust this endpoint to match your backend submission route
            await api.post(`/assignments/${assignmentId}/submit`);
            // Refresh data to show "Submitted" state
            const res = await api.get<Assignment>(`/assignments/${assignmentId}`);
            setAssignment(res.data);
            alert("Assignment submitted successfully! 🐾");
        } catch (err) {
            console.error(err);
            alert("Failed to submit assignment.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <p className="text-gray-500 animate-pulse text-lg">Fetching assignment details...</p>
            </div>
        );
    }

    if (!assignment) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <p className="text-gray-600 font-medium">Assignment not found 😿</p>
            </div>
        );
    }

    // Safely find the current user's entry or default to null
    // If the backend returns only the logged-in user's data in 'users', this works.
    const userSubmission = assignment.users && assignment.users.length > 0 ? assignment.users[0] : null;
    const isSubmitted = !!userSubmission?.submittedAt;
    const hasGrade = userSubmission?.grade !== null && userSubmission?.grade !== undefined;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="rounded-3xl bg-gradient-to-r from-pink-100 to-indigo-100 p-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            {assignment.assignmentName}
                        </h1>
                    </div>
                    {hasGrade && (
                        <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-sm text-center border border-white">
                            <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Grade</p>
                            <p className="text-3xl font-black text-gray-800">{userSubmission?.grade}%</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Assignment Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4 border border-gray-50">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        Description
                    </h2>
                    <p className="text-gray-600 mt-1 whitespace-pre-line leading-relaxed">
                        {assignment.assignmentDescription || "No description provided for this task. Good luck!"}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            Due Date
                        </h2>
                        <p className="text-gray-600 mt-1">
                            {new Date(assignment.dueDate).toLocaleDateString(undefined, {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            Status
                        </h2>
                        <p className={`mt-1 font-bold ${isSubmitted ? "text-green-500" : "text-pink-500"}`}>
                            {isSubmitted ? "✅ Turned In" : "⏳ Missing / Not Submitted"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
                <button
                    onClick={handleLevelSubmit}
                    disabled={isSubmitted || submitting}
                    className={`rounded-full px-8 py-3 text-sm font-bold text-white shadow-md transition-all flex items-center gap-2 ${
                        isSubmitted
                            ? "bg-gray-400 cursor-not-allowed opacity-70"
                            : "bg-gradient-to-r from-pink-400 to-indigo-400 hover:shadow-lg hover:scale-[1.03] active:scale-95"
                    }`}
                >
                    {submitting ? "Submitting..." : isSubmitted ? "✅ Submitted" : "🐾 Submit Assignment"}
                </button>

                <button className="rounded-full bg-white px-8 py-3 text-sm font-bold text-gray-700 shadow-sm hover:shadow-md hover:text-pink-500 transition-all border border-gray-100">
                    View Instructions
                </button>
            </div>
        </div>
    );
}