export default function TeacherTopNav() {
    return (
        <header className="relative m-4 mt-2 rounded-[3rem] overflow-hidden shadow-md bg-white">
            {/* paper base FIRST */}
            <div className="absolute inset-0 bg-gray-50" />

            {/* doodle pattern ON TOP of paper */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `
                        radial-gradient(circle at 15% 20%, #cbd5e1 6%, transparent 7%),
                        radial-gradient(circle at 80% 30%, #cbd5e1 6%, transparent 7%),
                        radial-gradient(circle at 40% 75%, #cbd5e1 6%, transparent 7%),
                        radial-gradient(circle at 65% 55%, #cbd5e1 6%, transparent 7%)
                    `,
                    backgroundSize: "120px 120px",
                }}
            />

            {/* soft kawaii blobs */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-200 rounded-full blur-[160px] opacity-30" />
            <div className="absolute -top-20 -right-28 w-[26rem] h-[26rem] bg-slate-200 rounded-full blur-[170px] opacity-35" />
            <div className="absolute bottom-[-7rem] left-1/3 w-[30rem] h-[30rem] bg-gray-200 rounded-full blur-[180px] opacity-40" />

            {/* content */}
            <div className="relative z-10 flex items-center justify-between px-10 py-8">
                {/* left */}
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow">
                        🐱
                    </div>

                    <div className="bg-white px-6 py-3 rounded-full shadow-sm">
                        <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
                            Purr-fect Learnings
                            <span className="ml-2">🐾</span>
                        </h1>
                    </div>
                </div>

                {/* right */}
                <a
                    href={'/logout'}
                    className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:text-indigo-600 transition"
                >
                    Logout
                </a>
            </div>

            {/* sticker accents */}
            <span className="absolute top-6 right-10 text-xl opacity-30">⭐</span>
            <span className="absolute bottom-6 left-10 text-xl opacity-30">🐾</span>
            <span className="absolute top-12 left-1/3 text-lg opacity-30">🐟</span>
        </header>
    );
}