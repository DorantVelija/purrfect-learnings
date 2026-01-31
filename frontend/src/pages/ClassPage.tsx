import { useParams, useNavigate } from "react-router-dom";

/* ---------- Small UI components ---------- */

function Tab({ label, active = false }: { label: string; active?: boolean }) {
    return (
        <button
            className={`pb-3 px-2 font-medium transition ${
                active
                    ? "border-b-2 border-pink-400 text-pink-500"
                    : "text-gray-500 hover:text-pink-400"
            }`}
        >
            {label}
        </button>
    );
}

function AssignmentCard({
    id,
    title,
    due,
}: {
    id: string;
    title: string;
    due: string;
}) {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate(`assignments/${id}`)}
            className="cursor-pointer bg-white rounded-2xl p-6 shadow-sm hover:shadow-md hover:scale-[1.01] transition"
        >
            <h3 className="font-semibold text-gray-700">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">Due: {due}</p>
        </div>
    );
}

/* ---------- Page ---------- */

export default function ClassPage() {
    const { slug } = useParams<{ slug: string }>();

    const title = slug
        ? slug
            .split("-")
            .map(word => word[0].toUpperCase() + word.slice(1))
            .join(" ")
        : "Class";

    return (
        <div className="space-y-10">
            {/* ===== Header (illustrated style) ===== */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-[#fffaf5] p-10 shadow-sm">
                {/* blobs */}
                <div className="absolute -top-20 -left-20 w-72 h-72 bg-pink-200 rounded-full blur-[100px] opacity-60" />
                <div className="absolute top-10 -right-24 w-80 h-80 bg-blue-200 rounded-full blur-[100px] opacity-60" />
                <div className="absolute bottom-[-6rem] left-1/3 w-96 h-96 bg-yellow-100 rounded-full blur-[120px] opacity-70" />

                {/* content */}
                <div className="relative z-10">
                    <span className="inline-block mb-4 px-4 py-1 text-sm font-medium rounded-full bg-white/70 text-gray-600 shadow-sm">
                        🐾 Class
                    </span>

                    <h1 className="text-5xl font-black tracking-tight text-gray-700">
                        {title}
                    </h1>

                    <p className="mt-4 max-w-xl text-gray-600 leading-relaxed">
                        Welcome to <span className="font-medium">{title}</span> —
                        a cozy place to learn, explore, and share your pawsome ideas.
                    </p>
                </div>
            </div>

            {/* ===== Tabs ===== */}
            <div className="flex gap-8 border-b border-gray-200">
                <Tab label="Stream" active />
                <Tab label="Classwork" />
                <Tab label="People" />
            </div>

            {/* ===== Content ===== */}
            <div className="space-y-4">
                <AssignmentCard
                    id="1"
                    title="Homework 1"
                    due="Tomorrow"
                />
                <AssignmentCard
                    id="2"
                    title="Project: Cat Research"
                    due="Next week"
                />
            </div>
        </div>
    );
}