import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function Register() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState(2); // 0=Admin, 1=Teacher, 2=Student
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleRegister() {
        if (!email || !name || !password) {
            alert("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords don't match 😿");
            return;
        }

        setLoading(true);
        try {
            await api.post("/auth/register", {
                email,
                name,
                password,
                role // Send as integer: 0=Admin, 1=Teacher, 2=Student
            });
            navigate("/login");
        } catch (error: any) {
            console.error("Registration error:", error);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);
            const errorMsg = typeof error.response?.data === 'string'
                ? error.response?.data
                : JSON.stringify(error.response?.data) || error.message;
            alert(`Registration failed 😿\n${errorMsg}`);
        } finally {
            setLoading(false);
        }
    }

    function handleKeyPress(e: React.KeyboardEvent) {
        if (e.key === "Enter") {
            handleRegister();
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f7f3ee]">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-[#fff8f3] p-10 shadow-sm w-[26rem]">
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
                <div className="relative z-10 space-y-6">
                    <div className="text-center space-y-2">
                        <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-sm">
                            🐱
                        </div>

                        <h2 className="text-3xl font-black tracking-tight text-[#6b4f3f]">
                            Join the Class
                        </h2>

                        <p className="text-gray-600">
                            Create your cozy classroom account 🐾
                        </p>
                    </div>

                    <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full rounded-full border border-gray-200 px-5 py-3 text-gray-700 bg-white/90 focus:outline-none focus:ring-2 focus:ring-pink-300"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full rounded-full border border-gray-200 px-5 py-3 text-gray-700 bg-white/90 focus:outline-none focus:ring-2 focus:ring-pink-300"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full rounded-full border border-gray-200 px-5 py-3 text-gray-700 bg-white/90 focus:outline-none focus:ring-2 focus:ring-pink-300"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full rounded-full border border-gray-200 px-5 py-3 text-gray-700 bg-white/90 focus:outline-none focus:ring-2 focus:ring-pink-300"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                    />

                    <select
                        value={role}
                        onChange={(e) => setRole(Number(e.target.value))}
                        className="w-full rounded-full border border-gray-200 px-5 py-3 text-gray-700 bg-white/90 focus:outline-none focus:ring-2 focus:ring-pink-300"
                        disabled={loading}
                    >
                        <option value={2}>Student 🐱</option>
                        <option value={1}>Teacher 👨‍🏫</option>
                    </select>

                    <button
                        onClick={handleRegister}
                        disabled={loading}
                        className="w-full rounded-full bg-pink-400 px-6 py-3 font-semibold text-white shadow-sm hover:bg-pink-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Registering..." : "Register 🐾"}
                    </button>

                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <a
                            href="/login"
                            className="font-medium text-pink-500 hover:underline"
                        >
                            Login
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}