import type { ReactNode } from "react";
// Assuming you'll create a Teacher-specific Sidebar
import TeacherSidebar from "../layout/TeacherSidebar";
import TeacherTopNav from "../layout/TeacherTopNav";

export default function TeacherLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex bg-[#f0f4f8]"> {/* Slightly different background color */}
            <TeacherSidebar />
            <div className="flex-1 flex flex-col">
                <TeacherTopNav />
                <main className="p-6">
                    {/* You could add a 'Teacher Mode' badge here if you wanted */}
                    {children}
                </main>
            </div>
        </div>
    );
}