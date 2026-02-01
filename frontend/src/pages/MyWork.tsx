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
        <div className="space-y-8">
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
                    {assignments.map((asgn) => (
                        <div
                            key={asgn.assignmentId}
                            onClick={() => navigate(`/classes/${asgn.courseId}/assignments/${asgn.assignmentId}`)}
                            className="group cursor-pointer bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all border border-transparent hover:border-pink-100"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-xl group-hover:bg-pink-50 transition">
                                    📚
                                </div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    Class #{asgn.courseId}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{asgn.assignmentName}</h3>
                            <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                                {asgn.assignmentDescription || "No description provided."}
                            </p>
                            <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                                <span className="text-sm font-medium text-pink-500">
                                    Due {new Date(asgn.dueDate).toLocaleDateString()}
                                </span>
                                <span className="text-indigo-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition">
                                    View →
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}