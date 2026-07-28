function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 hover:border-blue-500 transition">

      <div className="flex justify-between items-center">

        <div>
          <p className="text-gray-400 text-sm">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-white mt-2">
            {value}
          </h2>
        </div>

        <div className={`text-4xl ${color}`}>
          {icon}
        </div>

      </div>

    </div>
  );
}

export default StatCard;