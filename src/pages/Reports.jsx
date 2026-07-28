import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import API from "../services/api";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Bar } from "react-chartjs-2";

import {
  FiTrendingUp,
  FiDollarSign,
  FiCreditCard,
  FiUsers,
} from "react-icons/fi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

function Reports() {

  const [report, setReport] = useState({
    totalRevenue: 0,
    totalExpense: 0,
    netProfit: 0,
    pendingPayments: 0,
    totalClients: 0,
    monthlyReport: [],
  });

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {

      const res = await API.get("/reports");

      setReport(res.data);

    } catch (err) {

      console.log(err);

    }
  };

  const revenueChart = {
    labels: report.monthlyReport.map(item => item.month),

    datasets: [

      {
        label: "Revenue",

        data: report.monthlyReport.map(item => item.revenue),

        borderColor: "#10B981",

        backgroundColor: "rgba(16,185,129,0.2)",

        fill: true,

        tension: 0.4,
      },

      {
        label: "Expense",

        data: report.monthlyReport.map(item => item.expense),

        borderColor: "#EF4444",

        backgroundColor: "rgba(239,68,68,0.2)",

        fill: true,

        tension: 0.4,
      },

    ],
  };

  const profitChart = {

    labels: report.monthlyReport.map(item => item.month),

    datasets: [

      {

        label: "Profit",

        data: report.monthlyReport.map(item => item.profit),

        backgroundColor: "#3B82F6",

      },

    ],

  };
    return (
    <Layout>
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold text-white mb-8">
          Reports & Analytics
        </h1>

        {/* Summary Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-10">

          <div className="bg-slate-900 rounded-xl p-6">
            <FiTrendingUp className="text-green-500 text-3xl mb-3" />
            <p className="text-gray-400">Revenue</p>
            <h2 className="text-2xl font-bold text-white">
              ₹{report.totalRevenue.toLocaleString()}
            </h2>
          </div>

          <div className="bg-slate-900 rounded-xl p-6">
            <FiCreditCard className="text-red-500 text-3xl mb-3" />
            <p className="text-gray-400">Expenses</p>
            <h2 className="text-2xl font-bold text-white">
              ₹{report.totalExpense.toLocaleString()}
            </h2>
          </div>

          <div className="bg-slate-900 rounded-xl p-6">
            <FiDollarSign className="text-blue-500 text-3xl mb-3" />
            <p className="text-gray-400">Net Profit</p>
            <h2 className="text-2xl font-bold text-white">
              ₹{report.netProfit.toLocaleString()}
            </h2>
          </div>

          <div className="bg-slate-900 rounded-xl p-6">
            <FiDollarSign className="text-yellow-500 text-3xl mb-3" />
            <p className="text-gray-400">Pending Payments</p>
            <h2 className="text-2xl font-bold text-white">
              ₹{report.pendingPayments.toLocaleString()}
            </h2>
          </div>

          <div className="bg-slate-900 rounded-xl p-6">
            <FiUsers className="text-cyan-500 text-3xl mb-3" />
            <p className="text-gray-400">Clients</p>
            <h2 className="text-2xl font-bold text-white">
              {report.totalClients}
            </h2>
          </div>

        </div>

        {/* Charts */}

        <div className="grid lg:grid-cols-2 gap-8 mb-10">

          <div className="bg-slate-900 rounded-xl p-6">

            <h2 className="text-xl font-semibold text-white mb-6">
              Revenue vs Expense
            </h2>

            <div className="h-80">
              <Line
                data={revenueChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>

          </div>

          <div className="bg-slate-900 rounded-xl p-6">

            <h2 className="text-xl font-semibold text-white mb-6">
              Monthly Profit
            </h2>

            <div className="h-80">
              <Bar
                data={profitChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>

          </div>

        </div>

        {/* Monthly Report Table */}

        <div className="bg-slate-900 rounded-xl p-6">

          <h2 className="text-xl font-semibold text-white mb-6">
            Monthly Report
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full text-white">

              <thead>

                <tr className="border-b border-slate-700">

                  <th className="text-left py-3">Month</th>
                  <th className="text-right">Revenue</th>
                  <th className="text-right">Expense</th>
                  <th className="text-right">Profit</th>

                </tr>

              </thead>

              <tbody>

                {report.monthlyReport.map((item) => (

                  <tr
                    key={item.month}
                    className="border-b border-slate-800 hover:bg-slate-800"
                  >

                    <td className="py-3">
                      {item.month}
                    </td>

                    <td className="text-right text-green-400">
                      ₹{item.revenue.toLocaleString()}
                    </td>

                    <td className="text-right text-red-400">
                      ₹{item.expense.toLocaleString()}
                    </td>

                    <td
                      className={`text-right font-semibold ${
                        item.profit >= 0
                          ? "text-blue-400"
                          : "text-red-500"
                      }`}
                    >
                      ₹{item.profit.toLocaleString()}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </Layout>
  );
}

export default Reports;