import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    async function handleLogin() {
        if (!email || !password) {
            alert("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            const response = await api.post("/auth/login", { email, password });
            console.log("Login response:", response);
            await login(); // Update auth context
            navigate("/dashboard");
        } catch (error: any) {
            console.error("Login error:", error);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);
            alert(`Login failed 😿\n${error.response?.data || error.message}`);
        } finally {
            setLoading(false);
        }
    }

    function handleKeyPress(e: React.KeyboardEvent) {
        if (e.key === "Enter") {
            handleLogin();
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
                            Welcome Back
                        </h2>

                        <p className="text-gray-600">
                            Log in to your cozy classroom 🐾
                        </p>
                    </div>

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

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full rounded-full bg-pink-400 px-6 py-3 font-semibold text-white shadow-sm hover:bg-pink-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Logging in..." : "Login 🐾"}
                    </button>

                    <p className="text-center text-sm text-gray-600">
                        Don't have an account yet?{" "}
                        <a
                            href="/register"
                            className="font-medium text-pink-500 hover:underline"
                        >
                            Register
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}