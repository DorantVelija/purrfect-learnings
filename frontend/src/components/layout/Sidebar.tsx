import { NavLink } from "react-router-dom";

// Kawaii, illustrated, soft Sidebar matching ClassCard + TopNav vibe
export default function Sidebar() {
    return (
        <aside className="relative w-64 overflow-hidden rounded-r-md] shadow-sm">
            {/* paper base */}
            <div className="absolute inset-0 bg-[#fff8f3]" />

            {/* doodle pattern */}
            <div
                className="absolute inset-0 opacity-50"
                style={{
                    backgroundImage: `
                        radial-gradient(circle at 20% 15%, #fbcfe8 6%, transparent 7%),
                        radial-gradient(circle at 80% 25%, #bfdbfe 6%, transparent 7%),
                        radial-gradient(circle at 40% 75%, #fde68a 6%, transparent 7%),
                        radial-gradient(circle at 60% 55%, #bbf7d0 6%, transparent 7%)
                    `,
                    backgroundSize: "120px 120px",
                }}
            />

            {/* soft blobs */}
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-pink-300 rounded-full blur-[140px] opacity-60" />
            <div className="absolute bottom-[-6rem] right-[-6rem] w-96 h-96 bg-blue-300 rounded-full blur-[150px] opacity-60" />

            {/* content */}
            <div className="relative z-10 p-6">
                {/* brand */}
                <div className="mb-10 flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-2xl">
                        🐾
                    </div>
                    <h2 className="text-xl font-black tracking-tight text-[#6b4f3f]">
                        Purr-fect
                    </h2>
                </div>

                {/* kawaii illustration */}
                <div className="mx-auto mb-8 flex flex-col items-center">
                    <div className="relative">
                        {/* Cat head */}
                        <div className="w-16 h-16 bg-pink-100 rounded-full border-4 border-white shadow flex items-center justify-center">
                            <span className="text-4xl">😺</span>
                        </div>
                        {/* Ears */}
                        <div className="absolute -left-3 -top-2 w-6 h-6 bg-pink-200 rounded-tl-full rounded-tr-3xl rotate-[-25deg] border-2 border-white" />
                        <div className="absolute -right-3 -top-2 w-6 h-6 bg-pink-200 rounded-tr-full rounded-tl-3xl rotate-[25deg] border-2 border-white" />
                        {/* Paw print */}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow text-pink-300 text-lg">🐾</div>
                        </div>
                    </div>
                </div>

                {/* nav */}
                <nav className="space-y-3">
                    <SidebarLink to="/dashboard">Dashboard</SidebarLink>
                    <SidebarLink to="/profile">Profile</SidebarLink>
                    <SidebarLink to="/my-work">My Work</SidebarLink>
                    <SidebarLink to="/leaderboard">Leaderboard</SidebarLink>
                    <SidebarLink to="/badges">Badges</SidebarLink>
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
                    ? "block rounded-full bg-white px-4 py-2 font-semibold text-pink-500 shadow-sm"
                    : "block rounded-full px-4 py-2 text-gray-700 hover:bg-white/80 hover:text-pink-500 transition"
            }
        >
            {children}
        </NavLink>
    );
}