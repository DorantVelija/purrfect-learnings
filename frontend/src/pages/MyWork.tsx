import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

interface MyAssignment {
    assignmentId: number;
    assignmentName: string;
    assignmentDescription: string;
    courseId: number;
    dueDate: string;
    // These fields come from the joined AssignmentUser table in your backend
    grade: number | null;
    submittedAt: string | null;
}

export default function MyWork() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState<MyAssignment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) return;

        api.get<MyAssignment[]>(`/assignments/user/me`)
            .then((res) => setAssignments(res.data))
            .catch((err) => console.error("Failed to load your work:", err))
            .finally(() => setLoading(false));
    }, [user?.id]);

    if (loading) {
        return <div className="p-10 text-center animate-pulse text-gray-400">🐾 Gathering your tasks...</div>;
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto p-4">
            <div className="mb-3">
                <span className="inline-block px-4 py-1 rounded-full bg-white/80 text-sm font-medium text-pink-500 shadow-sm">
                    ✨ My Work
                </span>
                <h1 className="text-4xl font-black text-gray-800 mt-4 tracking-tight">Your Assignments</h1>
            </div>

            {assignments.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-sm border border-gray-50">
                    <div className="text-5xl mb-4">🎉</div>
                    <h2 className="text-xl font-bold text-gray-700">All caught up!</h2>
                    <p className="text-gray-500">No pending assignments found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {assignments.map((asgn) => {
                        const isSubmitted = !!asgn.submittedAt;
                        const hasGrade = asgn.grade !== null;

                        return (
                            <div
                                key={asgn.assignmentId}
                                onClick={() => navigate(`/classes/${asgn.courseId}/assignments/${asgn.assignmentId}`)}
                                className="group cursor-pointer bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all border border-transparent hover:border-pink-100 relative overflow-hidden"
                            >
                                {/* Score Badge Overlay */}
                                {hasGrade && (
                                    <div className="absolute top-0 right-0 bg-indigo-500 text-white px-6 py-2 rounded-bl-[1.5rem] font-black text-lg shadow-sm">
                                        {asgn.grade}%
                                    </div>
                                )}

                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition ${
                                        isSubmitted ? "bg-green-50" : "bg-indigo-50"
                                    } group-hover:bg-pink-50`}>
                                        {isSubmitted ? "✅" : "📚"}
                                    </div>

                                    {!hasGrade && (
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                                            isSubmitted ? "bg-green-100 text-green-600" : "bg-pink-100 text-pink-600"
                                        }`}>
                                            {isSubmitted ? "Turned In" : "Pending"}
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold text-gray-800 mb-2 pr-12">{asgn.assignmentName}</h3>

                                <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                                    {asgn.assignmentDescription || "No description provided."}
                                </p>

                                <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Due Date</span>
                                        <span className="text-sm font-bold text-gray-700">
                                            {new Date(asgn.dueDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <span className="text-indigo-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition">
                                        Open Task →
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}