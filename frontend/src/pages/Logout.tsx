import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        api.post("/auth/logout")
            .catch(() => {
                // even if backend errors, still redirect
            })
            .finally(() => {
                navigate("/login", { replace: true });
            });
    }, [navigate]);

    return null;
}