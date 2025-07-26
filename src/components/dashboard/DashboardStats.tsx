import React from "react";
import { MdPeople, MdLibraryBooks, MdBookOnline, MdWarning } from "react-icons/md";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, color }) => {
  return (
      <div className='bg-white rounded-lg shadow-md p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm font-medium text-gray-600'>{title}</p>
            <p className='text-3xl font-bold text-gray-900 mt-2'>{value}</p>
            {change && (
                <div className='flex items-center mt-2'>
              <span className={`text-sm font-medium ${change.type === "increase" ? "text-green-600" : "text-red-600"}`}>
                {change.type === "increase" ? "+" : "-"}
                {Math.abs(change.value)}%
              </span>
                  <span className='text-sm text-gray-500 ml-1'>from last month</span>
                </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>{icon}</div>
        </div>
      </div>
  );
};

interface DashboardStatsProps {
  totalReaders: number;
  totalBooks: number;
  totalLendings: number;
  overdueCount: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
                                                         totalReaders,
                                                         totalBooks,
                                                         totalLendings,
                                                         overdueCount
                                                       }) => {

  const stats = [
    {
      title: "Total Readers",
      value: totalReaders,
      icon: <MdPeople className='w-6 h-6 text-blue-600' />,
      change: { value: 10, type: "increase" as const },
      color: "bg-blue-100",
    },
    {
      title: "Total Books",
      value: totalBooks,
      icon: <MdLibraryBooks className='w-6 h-6 text-green-600' />,
      change: { value: 5, type: "increase" as const },
      color: "bg-green-100",
    },
    {
      title: "Total Lendings",
      value: totalLendings,
      icon: <MdBookOnline className='w-6 h-6 text-purple-600' />,
      change: { value: 3, type: "decrease" as const },
      color: "bg-purple-100",
    },
    {
      title: "Overdue Books",
      value: overdueCount,
      icon: <MdWarning className='w-6 h-6 text-red-600' />,
      change: { value: 7, type: "increase" as const },
      color: "bg-red-100",
    },
  ];

  return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
        ))}
      </div>
  );
};

export default DashboardStats;
