import type {ReactNode} from "react";
import Sidebar from "../layout/Sidebar";
import TopNav from "../layout/TopNav";

export default function MainLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex bg-[#f7f3ee]">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <TopNav />
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}