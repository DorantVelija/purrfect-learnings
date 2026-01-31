import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import api from "../lib/api";

type Role = "Admin" | "Teacher" | "Student";

interface AuthUser {
    id: number;
    role: Role;
}

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    login: () => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const res = await api.get<AuthUser>("/auth/me");
            setUser(res.data);
        } catch (error: any) {
            // Only set user to null, don't redirect here
            // Let the RequireAuth component handle redirects
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async () => {
        await checkAuth();
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}