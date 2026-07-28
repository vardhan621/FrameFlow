import {
  FiCalendar,
  FiDollarSign,
  FiTruck,
  FiEdit,
  FiArrowRight,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function PriorityCenter({ stats }) {

  const navigate = useNavigate();

  return (

    <div className="mt-10">

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          🔥 Priority Center
        </h2>

        <span className="text-sm text-gray-400">
          Important Tasks
        </span>

      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* ================= TODAY SHOOTS ================= */}

        <div className="bg-slate-900 rounded-2xl border border-cyan-500/60 p-6 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1 transition-all duration-300">

          <div className="flex justify-between items-center mb-5">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-cyan-500/15 flex items-center justify-center">

                <FiCalendar className="text-cyan-400 text-2xl"/>

              </div>

              <div>

                <h3 className="text-xl font-bold text-white">
                  Today's Shoots
                </h3>

                <p className="text-gray-400 text-sm">
                  Events scheduled today
                </p>

              </div>

            </div>

            <span className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm font-semibold">

              {stats.todayPriority?.length || 0}

            </span>

          </div>

          {stats.todayPriority?.length === 0 ? (

            <div className="text-center py-8">

              <FiCheckCircle className="mx-auto text-4xl text-green-500 mb-3"/>

              <p className="text-gray-400">
                No Shoots Today
              </p>

            </div>

          ) : (

            stats.todayPriority.slice(0,3).map(item => (

              <div
                key={item._id}
                className="flex justify-between items-center border-b border-slate-800 py-4"
              >

                <div>

                  <p className="text-white font-semibold">
                    {item.clientName}
                  </p>

                  <div className="flex gap-3 mt-1 text-sm">

                    <span className="text-cyan-400">
                      {item.eventType}
                    </span>

                    <span className="text-gray-400 flex items-center gap-1">

                      <FiClock/>

                      {item.shootTime || "--"}

                    </span>

                  </div>

                </div>

                <button
                  onClick={() => navigate(`/clients/${item._id}`)}
                  className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg text-white flex items-center gap-2 transition"
                >

                  Open

                  <FiArrowRight/>

                </button>

              </div>

            ))

          )}

        </div>

        {/* ================= PENDING PAYMENTS ================= */}

        <div className="bg-slate-900 rounded-2xl border border-green-500/60 p-6 hover:shadow-xl hover:shadow-green-500/10 hover:-translate-y-1 transition-all duration-300">

          <div className="flex justify-between items-center mb-5">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-green-500/15 flex items-center justify-center">

                <FiDollarSign className="text-green-400 text-2xl"/>

              </div>

              <div>

                <h3 className="text-xl font-bold text-white">
                  Pending Payments
                </h3>

                <p className="text-gray-400 text-sm">
                  Payments to collect
                </p>

              </div>

            </div>

            <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-semibold">

              {stats.paymentPriority?.length || 0}

            </span>

          </div>

          {stats.paymentPriority?.length === 0 ? (

            <div className="text-center py-8">

              <FiCheckCircle className="mx-auto text-4xl text-green-500 mb-3"/>

              <p className="text-gray-400">
                No Pending Payments
              </p>

            </div>

          ) : (

            stats.paymentPriority.slice(0,3).map(item => (

              <div
                key={item._id}
                className="flex justify-between items-center border-b border-slate-800 py-4"
              >

                <div>

                  <p className="text-white font-semibold">
                    {item.clientName}
                  </p>

                  <p className="text-green-400 font-bold mt-1">
                    Pending : ₹{Number(item.pendingAmount).toLocaleString()}
                  </p>

                </div>

                <button
                  onClick={() => navigate(`/clients/${item._id}`)}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white flex items-center gap-2 transition"
                >

                  Collect

                  <FiArrowRight/>

                </button>

              </div>

            ))

          )}

        </div>
                {/* ================= OVERDUE EDITING ================= */}

        <div className="bg-slate-900 rounded-2xl border border-red-500/60 p-6 hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-1 transition-all duration-300">

          <div className="flex justify-between items-center mb-5">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-red-500/15 flex items-center justify-center">
                <FiEdit className="text-red-400 text-2xl"/>
              </div>

              <div>

                <h3 className="text-xl font-bold text-white">
                  Overdue Editing
                </h3>

                <p className="text-gray-400 text-sm">
                  Editing delayed
                </p>

              </div>

            </div>

            <span className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm font-semibold">
              {stats.overdueEditing?.length || 0}
            </span>

          </div>

          {stats.overdueEditing?.length === 0 ? (

            <div className="text-center py-8">

              <FiCheckCircle className="mx-auto text-4xl text-green-500 mb-3"/>

              <p className="text-gray-400">
                No Overdue Editing
              </p>

            </div>

          ) : (

            stats.overdueEditing.slice(0,3).map(item => (

              <div
                key={item._id}
                className="flex justify-between items-center border-b border-slate-800 py-4"
              >

                <div>

                  <p className="text-white font-semibold">
                    {item.clientName}
                  </p>

                  <span className="inline-block mt-2 bg-red-500/20 text-red-300 text-xs px-3 py-1 rounded-full">
                    Overdue by {item.days} Days
                  </span>

                </div>

                <button
                  onClick={() => navigate(`/clients/${item._id}`)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white flex items-center gap-2 transition"
                >

                  Open

                  <FiArrowRight/>

                </button>

              </div>

            ))

          )}

        </div>

        {/* ================= DELIVERY PENDING ================= */}

        <div className="bg-slate-900 rounded-2xl border border-yellow-500/60 p-6 hover:shadow-xl hover:shadow-yellow-500/10 hover:-translate-y-1 transition-all duration-300">

          <div className="flex justify-between items-center mb-5">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-yellow-500/15 flex items-center justify-center">
                <FiTruck className="text-yellow-400 text-2xl"/>
              </div>

              <div>

                <h3 className="text-xl font-bold text-white">
                  Delivery Pending
                </h3>

                <p className="text-gray-400 text-sm">
                  Albums ready to deliver
                </p>

              </div>

            </div>

            <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm font-semibold">
              {stats.deliveryPriority?.length || 0}
            </span>

          </div>

          {stats.deliveryPriority?.length === 0 ? (

            <div className="text-center py-8">

              <FiCheckCircle className="mx-auto text-5xl text-green-500 mb-3"/>

              <h4 className="text-green-400 font-bold text-lg">
                All Deliveries Completed
              </h4>

              <p className="text-gray-500 mt-2">
                Nothing pending 🎉
              </p>

            </div>

          ) : (

            stats.deliveryPriority.slice(0,3).map(item => (

              <div
                key={item._id}
                className="flex justify-between items-center border-b border-slate-800 py-4"
              >

                <div>

                  <p className="text-white font-semibold">
                    {item.clientName}
                  </p>

                  <p className="text-yellow-400 text-sm mt-1">
                    Album Ready
                  </p>

                </div>

                <button
                  onClick={() => navigate(`/clients/${item._id}`)}
                  className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg text-white flex items-center gap-2 transition"
                >

                  Deliver

                  <FiArrowRight/>

                </button>

              </div>

            ))

          )}

        </div>

      </div>

    </div>

  );

}

export default PriorityCenter;