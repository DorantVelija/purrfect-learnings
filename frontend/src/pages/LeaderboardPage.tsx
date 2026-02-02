import { useEffect, useState } from "react";
import api from "../lib/api";

interface Entry {
    name: string;
    profilePictureUrl?: string;
    totalScore: number;
    perfectGradesCount: number;
}

export default function LeaderboardPage() {
    const [data, setData] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get<Entry[]>("/user/leaderboard")
            .then(res => setData(res.data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-20 text-center font-bold text-gray-400 animate-pulse">🐾 Calculating ranks...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 pb-20 space-y-10">
            <div className="text-center">
                <h1 className="text-5xl font-black text-[#4a372b] tracking-tight">Hall of Paws 🏆</h1>
                <p className="text-gray-500 mt-2 font-medium">Top achievers in the litter</p>
            </div>

            {/* Podium */}
            <div className="flex justify-center items-end gap-4 h-64">
                {[data[1], data[0], data[2]].map((u, i) => u && (
                    <div key={u.name} className="flex flex-col items-center flex-1">
                        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-4 bg-white mb-4 shadow-sm overflow-hidden flex items-center justify-center text-3xl ${i === 1 ? 'border-yellow-400 scale-125' : 'border-gray-100'}`}>
                            {u.profilePictureUrl ? <img src={u.profilePictureUrl} className="w-full h-full object-cover" /> : "🐱"}
                        </div>
                        <div className={`w-full rounded-t-2xl p-4 text-center border border-b-0 ${i === 1 ? 'bg-yellow-100 h-32' : 'bg-gray-50 h-24'}`}>
                            <p className="font-black text-gray-800 truncate text-sm">{u.name}</p>
                            <p className="text-xs font-bold text-gray-500">{u.totalScore} pts</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* List */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-orange-50 overflow-hidden">
                {data.map((u, i) => (
                    <div key={u.name} className="flex items-center justify-between p-6 border-b border-orange-50 last:border-0">
                        <div className="flex items-center gap-4">
                            <span className={`w-6 font-black ${i < 3 ? 'text-pink-400' : 'text-gray-300'}`}>#{i + 1}</span>
                            <div className="w-10 h-10 rounded-full bg-orange-50 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center">
                                {u.profilePictureUrl ? <img src={u.profilePictureUrl} className="w-full h-full object-cover" /> : "🐾"}
                            </div>
                            <span className="font-bold text-gray-800">{u.name}</span>
                        </div>
                        <div className="text-right">
                            <p className="font-black text-gray-700">{u.totalScore} <span className="text-[10px] text-gray-400 uppercase">pts</span></p>
                            <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest">{u.perfectGradesCount} Perfects</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}