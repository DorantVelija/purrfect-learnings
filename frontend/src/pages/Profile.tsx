import { useEffect, useState } from "react";
import api from "../lib/api";

interface UserProfile {
    id: number;
    name: string;
    email: string;
    role: string;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get<UserProfile>("/user/profile")
            .then(res => setProfile(res.data))
            .catch(err => console.error("Failed to load profile:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <div className="text-4xl mb-2">🐱</div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <div className="text-4xl mb-2">😿</div>
                    <p className="text-gray-600">Failed to load profile</p>
                </div>
            </div>
        );
    }

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

                {/* content */}
                <div className="relative z-10">
                    <span className="inline-block mb-4 px-4 py-1 rounded-full bg-white/80 text-sm font-medium text-pink-500 shadow-sm">
                        🐾 Profile
                    </span>

                    <h1 className="text-4xl font-black tracking-tight text-[#6b4f3f]">
                        Your Profile
                    </h1>

                    <p className="mt-3 text-gray-600">
                        Manage your personal information in a cozy way
                    </p>
                </div>
            </div>

            {/* Profile Card */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-sm">
                {/* soft blobs */}
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-pink-100 rounded-full blur-[100px] opacity-60" />
                <div className="absolute bottom-[-5rem] -left-20 w-72 h-72 bg-blue-100 rounded-full blur-[120px] opacity-60" />

                <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-6">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-full bg-white shadow-sm flex items-center justify-center text-4xl">
                            {profile.role === "Student" ? "🐱" : profile.role === "Teacher" ? "👨‍🏫" : "👑"}
                        </div>

                        {/* Basic Info */}
                        <div>
                            <h2 className="text-2xl font-extrabold text-gray-700">
                                {profile.name}
                            </h2>
                            <p className="text-gray-600">
                                {profile.email}
                            </p>
                            <span className="mt-2 inline-block px-3 py-1 rounded-full bg-pink-100 text-xs font-medium text-pink-600">
                                {profile.role}
                            </span>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ProfileField label="Full Name" value={profile.name} />
                        <ProfileField label="Email" value={profile.email} />
                        <ProfileField label="Role" value={profile.role} />
                        <ProfileField label="User ID" value={profile.id.toString()} />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-pink-500 shadow-sm hover:bg-pink-100 transition">
                    🐾 Edit Profile
                </button>

                <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-indigo-100 transition">
                    Change Password
                </button>
            </div>
        </div>
    );
}

function ProfileField({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-600">
                {label}
            </label>
            <input
                type="text"
                value={value}
                readOnly
                className="mt-1 w-full rounded-full border border-gray-200 px-5 py-3 text-gray-700 bg-gray-50"
            />
        </div>
    );
}