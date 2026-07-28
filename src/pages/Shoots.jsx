import Layout from "../components/layout/Layout";
import { useEffect, useState } from "react";
import API from "../services/api";
import ShootTable from "../components/shoot/ShootTable";

function Shoots() {

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState({
    today: 0,
    upcoming: 0,
    pending: 0,
    completed: 0,
  });

  useEffect(() => {
    fetchShoots();
  }, []);

  const fetchShoots = async () => {

    setLoading(true);

    try {

      const res = await API.get("/client");

      const data = res.data.clients;

      setClients(data);

      const today = new Date();
      today.setHours(0,0,0,0);

      let todayShoot = 0;
      let upcoming = 0;
      let pending = 0;
      let completed = 0;

      data.forEach((c)=>{

        const d = new Date(c.eventDate);
        d.setHours(0,0,0,0);

        if(d.getTime()===today.getTime())
          todayShoot++;

        if(d>=today)
          upcoming++;

        if(c.shootStatus==="Completed")
          completed++;
        else
          pending++;

      });

      setSummary({
        today:todayShoot,
        upcoming,
        pending,
        completed,
      });

    } catch(err){
      console.log(err);
    }

    setLoading(false);

  }

  return(

    <Layout>

      <h1 className="text-3xl font-bold text-white mb-6">
        Shoot Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
          <p className="text-gray-400">Today's Shoots</p>
          <h2 className="text-3xl text-blue-400 font-bold mt-2">
            {summary.today}
          </h2>
        </div>

        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
          <p className="text-gray-400">Upcoming</p>
          <h2 className="text-3xl text-green-400 font-bold mt-2">
            {summary.upcoming}
          </h2>
        </div>

        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
          <p className="text-gray-400">Pending Shoot</p>
          <h2 className="text-3xl text-yellow-400 font-bold mt-2">
            {summary.pending}
          </h2>
        </div>

        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
          <p className="text-gray-400">Completed Shoot</p>
          <h2 className="text-3xl text-purple-400 font-bold mt-2">
            {summary.completed}
          </h2>
        </div>

      </div>

      <ShootTable
        clients={clients}
        loading={loading}
        refresh={fetchShoots}
      />

    </Layout>

  )

}

export default Shoots;