import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardCharts from "../components/dashboard/DashboardCharts";
import RecentActivity from "../components/dashboard/RecentActivity";
import { MdLibraryBooks, MdPerson, MdBookOnline, MdWarning } from "react-icons/md";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const dashboardData = {
    totalReaders: 250,
    totalBooks: 1200,
    totalLendings: 430,
    overdueCount: 35,
    monthlyLendings: [
      { month: "Jan", lendings: 120 },
      { month: "Feb", lendings: 98 },
      { month: "Mar", lendings: 140 },
      { month: "Apr", lendings: 110 },
      { month: "May", lendings: 160 },
      { month: "Jun", lendings: 175 },
    ],
    popularBooks: [
      { name: "The Great Gatsby", lendings: 45 },
      { name: "To Kill a Mockingbird", lendings: 38 },
      { name: "1984", lendings: 50 },
      { name: "Harry Potter", lendings: 75 },
      { name: "Pride and Prejudice", lendings: 42 },
    ],
    recentActivities: [
      { id: 1, type: "lending", message: "Book '1984' lent to John Doe", time: "2 minutes ago" },
      { id: 2, type: "reader", message: "New reader Jane Smith registered", time: "15 minutes ago" },
      { id: 3, type: "book", message: "Stock updated for 'The Great Gatsby'", time: "1 hour ago" },
      { id: 4, type: "lending", message: "Book 'Harry Potter' returned by Alice Brown", time: "2 hours ago" },
      { id: 5, type: "reader", message: "Reader profile updated for Mike Johnson", time: "3 hours ago" },
    ],
  };

  const goToOverdueManagement = () => {
    navigate("/dashboard/overdue");
  };

  return (
      <div
          className="min-h-screen bg-gradient-to-tr from-teal-900 via-[#1f2937] to-teal-900 text-teal-100 p-8 font-sans mt-10"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-12 text-center">
            <h1 className="text-5xl font-extrabold tracking-wide mb-2 text-teal-400 drop-shadow-lg">
              Library Dashboard
            </h1>
            <p className="text-teal-300 text-lg font-light max-w-xl mx-auto">
              Get a comprehensive overview of your library’s performance and activities in real-time.
            </p>
          </header>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {/* Total Readers */}
            <div
                className="bg-gradient-to-r from-teal-700 to-teal-900 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:scale-105 hover:shadow-xl transition-transform cursor-pointer"
                title="Total Readers"
            >
              <MdPerson className="w-12 h-12 mb-3 text-teal-300" />
              <p className="text-3xl font-bold">{dashboardData.totalReaders}</p>
              <p className="text-teal-300 mt-1 uppercase tracking-wide font-semibold text-sm">
                Readers
              </p>
            </div>

            {/* Total Books */}
            <div
                className="bg-gradient-to-r from-cyan-700 to-cyan-900 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:scale-105 hover:shadow-xl transition-transform cursor-pointer"
                title="Total Books"
            >
              <MdLibraryBooks className="w-12 h-12 mb-3 text-cyan-300" />
              <p className="text-3xl font-bold">{dashboardData.totalBooks}</p>
              <p className="text-cyan-300 mt-1 uppercase tracking-wide font-semibold text-sm">
                Books
              </p>
            </div>

            {/* Total Lendings */}
            <div
                className="bg-gradient-to-r from-emerald-700 to-emerald-900 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:scale-105 hover:shadow-xl transition-transform cursor-pointer"
                title="Total Lendings"
            >
              <MdBookOnline className="w-12 h-12 mb-3 text-emerald-300" />
              <p className="text-3xl font-bold">{dashboardData.totalLendings}</p>
              <p className="text-emerald-300 mt-1 uppercase tracking-wide font-semibold text-sm">
                Lendings
              </p>
            </div>

            {/* Overdue Books */}
            <div
                onClick={goToOverdueManagement}
                className="bg-gradient-to-r from-rose-700 to-rose-900 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:scale-105 hover:shadow-xl transition-transform cursor-pointer"
                title="Manage overdue books"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") goToOverdueManagement(); }}
            >
              <MdWarning className="w-12 h-12 mb-3 text-rose-300" />
              <p className="text-3xl font-bold">{dashboardData.overdueCount}</p>
              <p className="text-rose-300 mt-1 uppercase tracking-wide font-semibold text-sm">Overdue</p>
            </div>
          </div>

          {/* Charts */}
          <div className="bg-gray-900 rounded-xl shadow-inner p-6 mb-10">
            <DashboardCharts
                monthlyLendings={dashboardData.monthlyLendings}
                popularBooks={dashboardData.popularBooks}
                // Make sure your chart components use matching teal/cyan/emerald colors
            />
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-1 bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col">
              <h3 className="text-xl font-semibold mb-6 text-teal-300 tracking-wide">
                Quick Actions
              </h3>
              <div className="flex flex-col space-y-4">
                <button
                    onClick={() => navigate("/dashboard/lendings/create")}
                    className="flex items-center space-x-3 p-4 bg-teal-700 rounded-lg hover:bg-teal-800 focus:ring-2 focus:ring-teal-400 transition-colors font-medium shadow-md"
                >
                  <MdBookOnline className="w-7 h-7" />
                  <span>Lend Book</span>
                </button>
                <button
                    onClick={() => navigate("/dashboard/readers/add")}
                    className="flex items-center space-x-3 p-4 bg-emerald-700 rounded-lg hover:bg-emerald-800 focus:ring-2 focus:ring-emerald-400 transition-colors font-medium shadow-md"
                >
                  <MdPerson className="w-7 h-7" />
                  <span>Add Reader</span>
                </button>
                <button
                    onClick={() => navigate("/dashboard/books/add")}
                    className="flex items-center space-x-3 p-4 bg-cyan-700 rounded-lg hover:bg-cyan-800 focus:ring-2 focus:ring-cyan-400 transition-colors font-medium shadow-md"
                >
                  <MdLibraryBooks className="w-7 h-7" />
                  <span>Add Book</span>
                </button>
                <button
                    onClick={goToOverdueManagement}
                    className="flex items-center space-x-3 p-4 bg-rose-700 rounded-lg hover:bg-rose-800 focus:ring-2 focus:ring-rose-400 transition-colors font-medium shadow-md"
                >
                  <MdWarning className="w-7 h-7" />
                  <span>Overdue Books</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div
                className="lg:col-span-2 bg-gray-900 rounded-xl shadow-lg p-6 max-h-[400px] overflow-y-auto recent-activity-scrollbar"
                aria-label="Recent activity"
            >
              <h3 className="text-xl font-semibold mb-6 text-teal-300 tracking-wide">
                Recent Activity
              </h3>
              <RecentActivity activities={dashboardData.recentActivities} />
            </div>
          </div>
        </div>

        {/* Scrollbar styling */}
        <style>{`
        .recent-activity-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .recent-activity-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .recent-activity-scrollbar::-webkit-scrollbar-thumb {
          background-color: #14b8a6; /* teal-400 */
          border-radius: 3px;
        }
        .recent-activity-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #14b8a6 transparent;
        }
      `}</style>
      </div>
  );
};

export default DashboardPage;
