import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import ClassGrid from "../components/classroom/ClassGrid";

export default function Dashboard() {
    const [joinCode, setJoinCode] = useState("");
    const navigate = useNavigate();

    const joinCourse = async () => {
        if (!joinCode.trim()) return;
        try {
            await api.post(`/course/${joinCode.trim()}/join`);
            setJoinCode("");
            window.location.reload();
        } catch (e: any) {
            console.error("Join course error:", e);
            alert("Failed to join course - invalid code or already joined");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            joinCourse();
        }
    };

    return (
        <div className="space-y-4">
            <div className="mb-3">
                <span className="inline-block px-4 py-1 rounded-full bg-white/80 text-sm font-medium text-pink-500 shadow-sm">
                    🐾 Dashboard
                </span>
            </div>

            <div className="flex gap-2 max-w-sm">
                <input
                    type="text"
                    placeholder="Enter class code"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="mt-1 w-full rounded-full border border-gray-200 px-5 py-3 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
                />

                <button
                    onClick={joinCourse}
                    className="rounded-full bg-gradient-to-r from-pink-400 to-indigo-400 px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition flex items-center gap-2"
                >
                    Join
                </button>
            </div>

            <div className="flex gap-2 max-w-sm">
                <button
                    onClick={() => navigate("/create-class")}
                    className="rounded-full bg-gradient-to-r from-pink-400 to-indigo-400 px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition flex items-center gap-2"
                >
                    Create class
                </button>
            </div>

            <ClassGrid />
        </div>
    );
}