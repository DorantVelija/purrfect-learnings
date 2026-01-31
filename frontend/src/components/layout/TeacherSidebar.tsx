import { NavLink } from "react-router-dom";

// Kawaii, illustrated, soft Sidebar matching ClassCard + TopNav vibe
export default function TeacherSidebar() {
    return (
        <aside className="relative w-64 overflow-hidden rounded-r-2xl shadow-md bg-white">
            {/* paper base */}
            <div className="absolute inset-0 bg-gray-50" />

            {/* doodle pattern */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `
                        radial-gradient(circle at 20% 15%, #cbd5e1 6%, transparent 7%),
                        radial-gradient(circle at 80% 25%, #cbd5e1 6%, transparent 7%),
                        radial-gradient(circle at 40% 75%, #cbd5e1 6%, transparent 7%),
                        radial-gradient(circle at 60% 55%, #cbd5e1 6%, transparent 7%)
                    `,
                    backgroundSize: "140px 140px",
                }}
            />

            {/* soft blobs */}
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-indigo-200 rounded-full blur-[160px] opacity-30" />
            <div className="absolute bottom-[-6rem] right-[-6rem] w-96 h-96 bg-slate-200 rounded-full blur-[180px] opacity-40" />

            {/* content */}
            <div className="relative z-10 p-6">
                {/* brand */}
                <div className="mb-10 flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow text-xl">
                        🐾
                    </div>
                    <h2 className="text-lg font-semibold tracking-tight text-gray-800">
                        Purr-fect
                    </h2>
                </div>

                {/* kawaii illustration */}
                <div className="mx-auto mb-8 flex flex-col items-center">
                    <div className="relative">
                        {/* Cat head */}
                        <div className="w-16 h-16 bg-gray-100 rounded-full border-4 border-white shadow flex items-center justify-center">
                            <span className="text-4xl">😺</span>
                        </div>
                        {/* Ears */}
                        <div className="absolute -left-3 -top-2 w-6 h-6 bg-gray-200 rounded-tl-full rounded-tr-3xl rotate-[-25deg] border-2 border-white" />
                        <div className="absolute -right-3 -top-2 w-6 h-6 bg-gray-200 rounded-tr-full rounded-tl-3xl rotate-[25deg] border-2 border-white" />
                        {/* Paw print */}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow text-gray-400 text-lg">🐾</div>
                        </div>
                    </div>
                </div>

                {/* nav */}
                <nav className="space-y-3">
                    <SidebarLink to="/dashboard">Dashboard</SidebarLink>
                    <SidebarLink to="/profile">Profile</SidebarLink>
                </nav>
            </div>
        </aside>
    );
}

function SidebarLink({ to, children }: { to: string; children: string }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                isActive
                    ? "block rounded-full bg-white px-4 py-2 font-semibold text-indigo-600 shadow-sm"
                    : "block rounded-full px-4 py-2 text-gray-700 hover:bg-white hover:text-indigo-600 transition"
            }
        >
            {children}
        </NavLink>
    );
}