import { Link } from "react-router-dom";
import api from "../../lib/api";

type ClassCardProps = {
    title: string;
    subtitle: string;
    color: string;
    to: string;
    courseId: number;
    icon?: string;
};

export default function ClassCard({
    title,
    subtitle,
    color,
    to,
    courseId,
    icon = "🐱",
}: ClassCardProps) {
    const handleLeave = async (e: React.MouseEvent) => {
        e.preventDefault(); // prevent Link navigation
        e.stopPropagation();

        if (!confirm("Leave this class?")) return;

        try {
            await api.delete(`/course/${courseId}/leave`);
            window.location.reload();
        } catch {
            alert("Failed to leave class");
        }
    };
    return (
        <Link to={to} className="group block">
            <div
                className={`relative overflow-hidden rounded-[2.5rem] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${color}`}
            >
                {/* doodle pattern */}
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        backgroundImage: `
                            radial-gradient(circle at 15% 20%, white 6%, transparent 7%),
                            radial-gradient(circle at 80% 30%, white 6%, transparent 7%),
                            radial-gradient(circle at 40% 75%, white 6%, transparent 7%)
                        `,
                        backgroundSize: "120px 120px",
                    }}
                />

                {/* sticker blobs */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/60 rounded-full blur-2xl" />
                <div className="absolute bottom-[-2rem] right-[-2rem] w-40 h-40 bg-white/40 rounded-full blur-2xl" />

                {/* content */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl shadow-sm group-hover:scale-105 transition">
                        {icon}
                    </div>

                    <h3 className="font-extrabold text-lg text-gray-700">
                        {title}
                    </h3>

                    <span className="bg-white/80 px-4 py-1 rounded-full text-sm text-gray-600 shadow-sm">
                        {subtitle}
                    </span>
                </div>

                {/* corner stickers */}
                <span className="absolute top-4 right-4 text-xl opacity-70">⭐</span>
                <span className="absolute bottom-4 left-4 text-xl opacity-70">🐾</span>
                <button
                    onClick={handleLeave}
                    className="absolute bottom-4 right-4 text-xs bg-white/80 hover:bg-red-100 text-red-600 px-3 py-1 rounded-full shadow-sm z-20"
                >
                    Leave
                </button>
            </div>
        </Link>
    );
}