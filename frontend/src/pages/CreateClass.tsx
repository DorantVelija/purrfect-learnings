import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function CreateClass() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            await api.post("/course/", {
                name: name.trim(),
                description: description.trim()
            });
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            alert("Failed to create class.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 max-w-sm"
        >
            {/* Header — same as Dashboard */}
            <div className="mb-3">
                <span className="inline-block px-4 py-1 rounded-full bg-white/80 text-sm font-medium text-pink-500 shadow-sm">
                    🐾 Create Class
                </span>
            </div>

            {/* Class name */}
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Class name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-full border border-gray-200 px-5 py-3 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    required
                    disabled={loading}
                />
            </div>

            {/* Description */}
            <div className="flex gap-2">
                <textarea
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="mt-1 w-full rounded-2xl border border-gray-200 px-5 py-3 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
                    disabled={loading}
                />
            </div>

            {/* Actions — same buttons as Dashboard */}
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="rounded-full bg-white border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition"
                    disabled={loading}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="rounded-full bg-gradient-to-r from-pink-400 to-indigo-400 px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create class"}
                </button>
            </div>
        </form>
    );
}