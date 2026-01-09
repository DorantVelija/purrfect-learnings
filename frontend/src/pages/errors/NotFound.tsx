import React from 'react';

const NotFound: React.FC = () => {
    return (
        <main className="grid min-h-screen place-items-center bg-gray-950 px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                {/* Error Code */}
                <p className="text-7xl font-bold text-indigo-600">404</p>

                {/* Main Text */}
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
                    Page not found
                </h1>

                <p className="mt-6 text-base leading-7 text-gray-400">
                    Sorry, we couldn’t find the page you’re looking for.
                </p>

                {/* Action Buttons */}
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <a
                        href="#"
                        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Go back home
                    </a>
                    <a href="#" className="text-sm font-semibold text-gray-300">
                        Contact support <span aria-hidden="true">&rarr;</span>
                    </a>
                </div>
            </div>
        </main>
    );
};

export default NotFound;