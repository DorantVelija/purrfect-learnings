import { useEffect, useState } from "react";
import api from "../lib/api";

interface UserStatsDto {
  userId: number;
  name: string;
  onTimeSubmissions: number;
  perfectGradesCount: number;
  assignmentsCompleted: number;
}

type Badge = {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  icon: string;
  color: string;
};

export default function BadgesPage() {
  const [stats, setStats] = useState<UserStatsDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // FIX: Changed endpoint to /user/me to match your C# controller
    api.get<UserStatsDto>("/user/me")
        .then((res) => setStats(res.data))
        .catch((err) => console.error("Failed to load stats:", err))
        .finally(() => setLoading(false));
  }, []);

  const badgeData: Badge[] = [
    {
      id: "on-time",
      title: "On-Time Kitty",
      description: "Submit assignments before the deadline",
      progress: stats?.onTimeSubmissions || 0,
      target: 10,
      icon: "⏰🐱",
      color: "from-pink-400 to-rose-400",
    },
    {
      id: "perfect-grades",
      title: "Perfect Paws",
      description: "Get 100% on assignments",
      progress: stats?.perfectGradesCount || 0,
      target: 5,
      icon: "✨🐾",
      color: "from-yellow-400 to-orange-400",
    },
    {
      id: "grind",
      title: "Homework Grinder",
      description: "Total assignments completed",
      progress: stats?.assignmentsCompleted || 0,
      target: 20,
      icon: "📚🐱",
      color: "from-indigo-400 to-purple-400",
    },
  ];

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <div className="text-4xl animate-bounce">🐾</div>
          <p className="text-gray-400 font-medium animate-pulse">Polishing your medals...</p>
        </div>
    );
  }

  return (
      <div className="space-y-10 max-w-6xl mx-auto p-4 pb-20">
        {/* Header Card */}
        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#fff8f3] to-[#fff1f2] p-12 shadow-sm border border-orange-50">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-200/30 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-200/30 rounded-full blur-[100px]" />

          <div className="relative z-10">
            <span className="inline-block mb-4 px-6 py-2 rounded-full bg-white text-sm font-bold text-pink-500 shadow-sm border border-pink-50">
              🏅 Achievement Gallery
            </span>
            <h1 className="text-5xl font-black tracking-tight text-[#4a372b]">
              Your Badges
            </h1>
            <p className="mt-4 text-gray-600 text-lg max-w-md leading-relaxed">
              Earn badges by learning, submitting, and being pawsome 🐾
            </p>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {badgeData.map((badge) => {
            const percent = Math.min(Math.round((badge.progress / badge.target) * 100), 100);
            const isCompleted = badge.progress >= badge.target;

            return (
                <div
                    key={badge.id}
                    className={`group relative overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-sm transition-all duration-500 ${
                        isCompleted ? "border-2 border-pink-100 ring-4 ring-pink-50/50 scale-[1.02]" : "border border-gray-50 hover:shadow-md hover:-translate-y-1"
                    }`}
                >
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-5">
                      <div className={`text-6xl transition-all duration-700 ${!isCompleted ? "grayscale opacity-30 scale-90 rotate-[-10deg]" : "drop-shadow-xl scale-110 rotate-0"}`}>
                        {badge.icon}
                      </div>
                      <div>
                        <h3 className="font-black text-gray-800 text-xl leading-tight">
                          {badge.title}
                        </h3>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">
                          {badge.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                        <span className="text-xs font-black text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                          {badge.progress} / {badge.target}
                        </span>
                        <span className={`text-lg font-black ${isCompleted ? "text-pink-500" : "text-indigo-400"}`}>
                          {percent}%
                        </span>
                      </div>
                      <div className="h-5 w-full bg-gray-100 rounded-full overflow-hidden p-1 shadow-inner">
                        <div
                            className={`h-full rounded-full transition-all duration-[1.5s] ease-out bg-gradient-to-r ${badge.color}`}
                            style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    <div className="min-h-[24px]">
                      {isCompleted ? (
                          <div className="flex items-center gap-2 text-sm font-black text-pink-500">
                            <span className="animate-ping">✨</span> Badge Earned!
                          </div>
                      ) : (
                          <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                            Keep going, kitty!
                          </div>
                      )}
                    </div>
                  </div>

                  {!isCompleted && (
                      <div className="absolute top-6 right-8 text-gray-100 select-none opacity-50">
                        <span className="text-5xl font-black">🔒</span>
                      </div>
                  )}
                </div>
            );
          })}
        </div>
      </div>
  );
}