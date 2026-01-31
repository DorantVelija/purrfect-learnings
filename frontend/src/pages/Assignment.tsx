import { useParams } from "react-router-dom";

export default function AssignmentPage() {
    const { id, assignmentId } = useParams<{
        id: string;
        assignmentId: string;
    }>();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="rounded-3xl bg-gradient-to-r from-pink-100 to-indigo-100 p-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Assignment {assignmentId}
                </h1>
                <p className="text-gray-600 mt-2">
                    Class ID: {id}
                </p>
            </div>

            {/* Assignment Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        Description
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Complete the tasks described below and submit your work
                        before the deadline.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        Due Date
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Next week
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <button className="rounded-full bg-gradient-to-r from-pink-400 to-indigo-400 px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg transition">
                    🐾 Submit Assignment
                </button>

                <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:shadow-md hover:text-pink-500 transition">
                    View Instructions
                </button>
            </div>
        </div>
    );
}