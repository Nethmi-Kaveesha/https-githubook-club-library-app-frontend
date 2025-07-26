import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

interface DashboardChartsProps {
  monthlyLendings: Array<{ month: string; lendings: number }>;
  popularBooks: Array<{ name: string; lendings: number }>;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({
                                                           monthlyLendings,
                                                           popularBooks
                                                         }) => {
  return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* Monthly Lending Trend (Area Chart) */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Lending Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyLendings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                  type="monotone"
                  dataKey="lendings"
                  stroke="#4F46E5"
                  fill="#4F46E5"
                  fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Lending Trend (Line Chart) */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Lending Count</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyLendings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                  type="monotone"
                  dataKey="lendings"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Most Borrowed Books (Bar Chart) */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Borrowed Books</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={popularBooks} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="lendings" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Optional Fourth Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center text-gray-500">
          <p>No additional data chart.</p>
        </div>

      </div>
  );
};

export default DashboardCharts;
