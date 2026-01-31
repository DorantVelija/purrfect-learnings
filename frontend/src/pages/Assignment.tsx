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

    useEffect(() => {
        if (!assignmentId) return;

        api.get<Assignment>(`/assignments/${assignmentId}`)
            .then((res) => setAssignment(res.data))
            .catch((err) => console.error("Failed to load assignment:", err))
            .finally(() => setLoading(false));
    }, [assignmentId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <p className="text-gray-500 animate-pulse">Fetching assignment details...</p>
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

    // Checking the first user in the array (assuming current user logic is handled backend-side)
    const userSubmission = assignment.users?.[0];
    const isSubmitted = !!userSubmission?.submittedAt;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="rounded-3xl bg-gradient-to-r from-pink-100 to-indigo-100 p-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            {assignment.assignmentName}
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Class ID: {id} • Assignment ID: {assignmentId}
                        </p>
                    </div>
                    {userSubmission?.grade !== null && (
                        <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-sm text-center">
                            <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Grade</p>
                            <p className="text-2xl font-black text-gray-800">{userSubmission.grade}%</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Assignment Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        Description
                    </h2>
                    <p className="text-gray-600 mt-1 whitespace-pre-line">
                        {assignment.assignmentDescription || "No description provided for this task."}
                    </p>
                </div>

                <div className="flex gap-10">
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
                        <p className={`mt-1 font-medium ${isSubmitted ? "text-green-500" : "text-pink-500"}`}>
                            {isSubmitted ? "✅ Submitted" : "⏳ Not Submitted"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <button
                    disabled={isSubmitted}
                    className={`rounded-full px-6 py-3 text-sm font-semibold text-white shadow-md transition flex items-center gap-2 ${
                        isSubmitted
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-pink-400 to-indigo-400 hover:shadow-lg hover:scale-105"
                    }`}
                >
                    🐾 {isSubmitted ? "Assignment Turned In" : "Submit Assignment"}
                </button>

                <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:shadow-md hover:text-pink-500 transition border border-gray-100">
                    View Instructions
                </button>
            </div>
        </div>
    );
}