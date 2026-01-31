type Badge = {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  icon: string;
};

const badges: Badge[] = [
  {
    id: "on-time",
    title: "On-Time Kitty",
    description: "Submit assignments on time",
    progress: 37,
    target: 100,
    icon: "⏰🐱",
  },
  {
    id: "perfect-grades",
    title: "Perfect Paws",
    description: "Get perfect grades",
    progress: 10,
    target: 10,
    icon: "✨🐾",
  },
  {
    id: "grind",
    title: "Homework Grinder",
    description: "Complete assignments",
    progress: 152,
    target: 200,
    icon: "📚🐱",
  },
];

export default function BadgesPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-[#fff8f3] p-10 shadow-sm">
        {/* doodle pattern */}
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

        {/* blobs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-pink-300 rounded-full blur-[120px] opacity-60" />
        <div className="absolute top-10 -right-24 w-80 h-80 bg-blue-300 rounded-full blur-[140px] opacity-60" />

        <div className="relative z-10">
          <span className="inline-block mb-4 px-4 py-1 rounded-full bg-white/80 text-sm font-medium text-pink-500 shadow-sm">
            🏅 Badges
          </span>

          <h1 className="text-4xl font-black tracking-tight text-[#6b4f3f]">
            Your Achievements
          </h1>

          <p className="mt-3 text-gray-600">
            Earn badges by learning, submitting, and being pawsome 🐾
          </p>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge) => {
          const percent = Math.min(
            Math.round((badge.progress / badge.target) * 100),
            100
          );
          const completed = badge.progress >= badge.target;
          return (
            <div
              key={badge.id}
              className="relative overflow-hidden rounded-[2.5rem] bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              {/* soft blobs */}
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-pink-100 rounded-full blur-[100px] opacity-60" />
              <div className="absolute bottom-[-4rem] right-[-4rem] w-56 h-56 bg-blue-100 rounded-full blur-[120px] opacity-60" />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{badge.icon}</div>
                  <div>
                    <h3 className="font-extrabold text-gray-700">
                      {badge.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {badge.description}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>
                      {badge.progress} / {badge.target}
                    </span>
                    <span>{percent}%</span>
                  </div>
                  <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-400 to-indigo-400 transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {completed && (
                  <div className="text-sm font-semibold text-pink-500">
                    🎉 Badge earned!
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}