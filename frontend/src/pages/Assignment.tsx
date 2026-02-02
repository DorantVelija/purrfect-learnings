import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../lib/api";

interface AssignmentUser {
    assignmentId: number;
    userId: number;
    assignedAt: string;
    submittedAt: string | null;
    submissionText: string | null;
    grade: number | null;
    feedback: string | null;
}

interface Assignment {
    assignmentId: number;
    assignmentName: string;
    assignmentDescription: string;
    question: string;
    courseId: number;
    created: string;
    updated: string;
    dueDate: string;
    users: AssignmentUser[];
}

export default function AssignmentPage() {
    const { id, assignmentId } = useParams<{ id: string; assignmentId: string }>();

    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [answer, setAnswer] = useState("");

    useEffect(() => {
        if (!assignmentId) return;

        api.get<Assignment>(`/assignments/${assignmentId}`)
            .then((res) => {
                setAssignment(res.data);
                const userSub = res.data.users && res.data.users.length > 0 ? res.data.users[0] : null;
                if (userSub?.submissionText) {
                    setAnswer(userSub.submissionText);
                }
            })
            .catch((err) => console.error("Failed to load assignment:", err))
            .finally(() => setLoading(false));
    }, [assignmentId]);

    const handleLevelSubmit = async () => {
        if (!assignmentId || submitting || !answer.trim()) return;

        setSubmitting(true);
        try {
            await api.post(`/assignments/${assignmentId}/submit`, {
                submissionText: answer
            });

            const res = await api.get<Assignment>(`/assignments/${assignmentId}`);
            setAssignment(res.data);
            alert("Answer submitted! Great job! 🐾");
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.response?.data || "Server connection error.";
            console.error("Submission error:", err);
            alert(`Failed to submit: ${errorMessage}`);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><p className="text-gray-500 animate-pulse text-lg font-medium">Fetching task... 🐾</p></div>;
    if (!assignment) return <div className="flex items-center justify-center min-h-[50vh]"><p className="text-gray-600 font-medium">Assignment not found 😿</p></div>;

    const userSubmission = assignment.users && assignment.users.length > 0 ? assignment.users[0] : null;
    const isSubmitted = !!userSubmission?.submittedAt;
    const hasGrade = userSubmission?.grade !== null && userSubmission?.grade !== undefined;

    // DEADLINE LOGIC
    const isPastDeadline = assignment.dueDate ? new Date() > new Date(assignment.dueDate) : false;
    const canSubmit = !isSubmitted && !isPastDeadline;

    return (
        <div className="space-y-8 max-w-5xl mx-auto p-4 pb-20">
            {/* Header / Grade Card */}
            <div className="rounded-[2.5rem] bg-gradient-to-r from-pink-100 to-indigo-100 p-10 shadow-sm relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <span className="px-4 py-1 text-xs font-bold rounded-full bg-white/60 text-indigo-600 uppercase tracking-widest">Assignment Task</span>
                        <h1 className="text-4xl font-black text-gray-800 mt-2">{assignment.assignmentName}</h1>
                    </div>
                    {hasGrade && (
                        <div className="bg-white/90 backdrop-blur-md px-8 py-4 rounded-[2rem] shadow-sm text-center border border-white">
                            <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Score</p>
                            <p className="text-4xl font-black text-gray-800">{userSubmission?.grade}%</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Deadline Warning */}
                    {isPastDeadline && !isSubmitted && (
                        <div className="bg-red-50 border-2 border-red-100 rounded-[2rem] p-6 flex items-center gap-4 text-red-600">
                            <span className="text-2xl">⏰</span>
                            <div>
                                <p className="font-bold">The deadline has passed!</p>
                                <p className="text-sm">Submissions for this task are now closed.</p>
                            </div>
                        </div>
                    )}

                    {/* Instructions & Question */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Instructions</h2>
                        <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">{assignment.assignmentDescription || "No specific instructions."}</p>
                    </div>

                    <div className="bg-indigo-600 rounded-[2.5rem] p-8 shadow-lg text-white">
                        <h2 className="text-sm font-black text-indigo-200 uppercase tracking-widest mb-4">The Question</h2>
                        <p className="text-2xl font-bold leading-snug">{assignment.question}</p>
                    </div>

                    {/* Teacher Feedback */}
                    {userSubmission?.feedback && (
                        <div className="bg-amber-50 rounded-[2.5rem] p-8 border border-amber-100">
                            <h2 className="text-sm font-black text-amber-600 uppercase tracking-widest mb-2">Teacher Feedback 💬</h2>
                            <p className="text-gray-700 italic text-lg">"{userSubmission.feedback}"</p>
                        </div>
                    )}

                    {/* Answer Input */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 space-y-4">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Your Response</h2>
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            disabled={isSubmitted || isPastDeadline}
                            placeholder={isPastDeadline ? "Submission closed." : "Type your answer here..."}
                            className={`w-full min-h-[300px] rounded-3xl border border-gray-100 px-6 py-5 text-gray-700 bg-gray-50 focus:ring-4 focus:ring-indigo-100 outline-none transition-all resize-none text-lg ${(!canSubmit) ? "opacity-60 cursor-not-allowed" : ""}`}
                        />
                    </div>
                </div>

                {/* Status & Submit Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-50 space-y-6">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Due Date</label>
                            <p className={`font-bold ${isPastDeadline && !isSubmitted ? "text-red-500" : "text-gray-700"}`}>
                                {new Date(assignment.dueDate).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Status</label>
                            <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-sm font-bold ${
                                isSubmitted ? "bg-green-100 text-green-600" :
                                    isPastDeadline ? "bg-red-100 text-red-600" : "bg-pink-100 text-pink-600"
                            }`}>
                                {isSubmitted ? "✅ Submitted" : isPastDeadline ? "🚫 Closed" : "⏳ Pending"}
                            </div>
                        </div>
                        <hr className="border-gray-50" />
                        <button
                            onClick={handleLevelSubmit}
                            disabled={!canSubmit || submitting || !answer.trim()}
                            className={`w-full rounded-full py-4 text-white font-bold shadow-md transition-all active:scale-95 ${
                                !canSubmit ? "bg-gray-300 cursor-not-allowed shadow-none" : "bg-gradient-to-r from-pink-400 to-indigo-400 hover:shadow-lg hover:scale-[1.02]"
                            }`}
                        >
                            {submitting ? "Sending..." :
                                isSubmitted ? "Handed In" :
                                    isPastDeadline ? "Deadline Passed" : "Submit Answer 🚀"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}