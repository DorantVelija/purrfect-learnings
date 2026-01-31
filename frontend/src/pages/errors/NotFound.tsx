import React from 'react';
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
    return (
        <main className="grid min-h-screen place-items-center bg-gray-50 px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                {/* Error Code */}
                <p className="text-7xl font-bold text-indigo-600">404</p>

                {/* Main Text */}
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-700 sm:text-5xl">
                    Page not found
                </h1>

                <p className="mt-6 text-base leading-7 text-gray-600">
                    Sorry, we couldn’t find the page you’re looking for.
                </p>

                {/* Action Buttons */}
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                        to="/dashboard"
                        className="rounded-full bg-gradient-to-r from-pink-400 to-indigo-400 px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition flex items-center gap-2"
                    >
                        🐾 Go back home
                    </Link>
                    <Link
                        to="/dashboard"
                        className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:shadow-md hover:text-pink-500 transition flex items-center gap-2"
                    >
                        🐾 Contact support
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default NotFound;