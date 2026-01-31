export default function TopNav() {
    return (
        <header className="relative m-4 mt-2  rounded-[3rem] overflow-hidden shadow-md">
            {/* paper base FIRST */}
            <div className="absolute inset-0 bg-[#fff8f3]" />

            {/* doodle pattern ON TOP of paper */}
            <div
                className="absolute inset-0 opacity-50"
                style={{
                    backgroundImage: `
                        radial-gradient(circle at 15% 20%, #fbcfe8 6%, transparent 7%),
                        radial-gradient(circle at 80% 30%, #bfdbfe 6%, transparent 7%),
                        radial-gradient(circle at 40% 75%, #fde68a 6%, transparent 7%),
                        radial-gradient(circle at 65% 55%, #bbf7d0 6%, transparent 7%)
                    `,
                    backgroundSize: "120px 120px",
                }}
            />

            {/* soft kawaii blobs */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-300 rounded-full blur-[140px] opacity-60" />
            <div className="absolute -top-20 -right-28 w-[26rem] h-[26rem] bg-blue-300 rounded-full blur-[150px] opacity-60" />
            <div className="absolute bottom-[-7rem] left-1/3 w-[30rem] h-[30rem] bg-yellow-200 rounded-full blur-[160px] opacity-70" />

            {/* content */}
            <div className="relative z-10 flex items-center justify-between px-10 py-8">
                {/* left */}
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow">
                        🐱
                    </div>

                    <div className="bg-white/90 px-6 py-3 rounded-full shadow-sm">
                        <h1 className="text-2xl font-black tracking-tight text-[#6b4f3f]">
                            Purr-fect Learnings
                            <span className="ml-2">🐾</span>
                        </h1>
                    </div>
                </div>

                {/* right */}
                <a
                    href={'/logout'}
                    className="rounded-full bg-white/90 px-6 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-pink-100 transition"
                >
                    Logout
                </a>
            </div>

            {/* sticker accents */}
            <span className="absolute top-6 right-10 text-xl opacity-70">⭐</span>
            <span className="absolute bottom-6 left-10 text-xl opacity-70">🐾</span>
            <span className="absolute top-12 left-1/3 text-lg opacity-60">🐟</span>
        </header>
    );
}