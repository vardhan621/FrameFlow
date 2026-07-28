import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiUser, FiDollarSign, FiUsers } from "react-icons/fi";
import API from "../../services/api";

function SearchBar() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState({
    clients: [],
    employees: [],
    payments: [],
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (query.trim() === "") {
      setOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await API.get(`/search?q=${query}`);

        setResults(res.data);
        setOpen(true);

      } catch (err) {
        console.log(err);
      }
    }, 300);

    return () => clearTimeout(timer);

  }, [query]);

  return (
    <div className="relative w-96">

      <div className="flex items-center bg-slate-800 rounded-lg px-3">

        <FiSearch className="text-gray-400" />

        <input
          type="text"
          placeholder="Search clients, employees..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-transparent outline-none text-white px-3 py-2 w-full"
        />

      </div>

      {open && (

        <div className="absolute mt-2 w-full bg-[#111827] rounded-xl shadow-xl border border-gray-700 max-h-96 overflow-y-auto z-50">

          {results.clients.length > 0 && (

            <>
              <p className="px-4 py-2 text-xs text-gray-400">
                Clients
              </p>

              {results.clients.map((c) => (

                <div
                  key={c._id}
                  onClick={() => navigate(`/clients/${c._id}`)}
                  className="px-4 py-3 hover:bg-gray-800 cursor-pointer flex gap-3"
                >

                  <FiUser className="text-blue-500 mt-1" />

                  <div>

                    <p className="text-white">
                      {c.clientName}
                    </p>

                    <p className="text-gray-400 text-sm">
                      {c.phone}
                    </p>

                  </div>

                </div>

              ))}
            </>

          )}

          {results.employees.length > 0 && (

            <>
              <p className="px-4 py-2 text-xs text-gray-400">
                Employees
              </p>

              {results.employees.map((e) => (

                <div
                  key={e._id}
                  className="px-4 py-3 hover:bg-gray-800 flex gap-3"
                >

                  <FiUsers className="text-green-500 mt-1" />

                  <div>

                    <p className="text-white">
                      {e.name}
                    </p>

                    <p className="text-gray-400 text-sm">
                      {e.role}
                    </p>

                  </div>

                </div>

              ))}
            </>

          )}

          {results.payments.length > 0 && (

            <>
              <p className="px-4 py-2 text-xs text-gray-400">
                Payments
              </p>

              {results.payments.map((p) => (

                <div
                  key={p._id}
                  onClick={() => navigate("/payments")}
                  className="px-4 py-3 hover:bg-gray-800 cursor-pointer flex gap-3"
                >

                  <FiDollarSign className="text-green-500 mt-1" />

                  <div>

                    <p className="text-white">
                      {p.client?.clientName}
                    </p>

                    <p className="text-gray-400 text-sm">
                      ₹{p.amount}
                    </p>

                  </div>

                </div>

              ))}
            </>

          )}

          {results.clients.length === 0 &&
            results.employees.length === 0 &&
            results.payments.length === 0 && (

              <p className="text-gray-400 p-4 text-center">
                No Results Found
              </p>

            )}

        </div>

      )}

    </div>
  );
}

export default SearchBar;