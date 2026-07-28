import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  dateFnsLocalizer,
} from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";

import {
  format,
  parse,
  startOfWeek,
  getDay,
} from "date-fns";

import enUS from "date-fns/locale/en-US";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function CalendarPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {

    const res = await API.get("/client/calendar");

    const data = res.data.events.map((item) => ({
      title: item.title,
      start: new Date(item.date),
      end: new Date(item.date),

      resource: item,
    }));

    setEvents(data);
  };

  return (

    <Layout>

      <h1 className="text-3xl font-bold text-white mb-6">
        Shoot Calendar
      </h1>

      <div className="bg-white rounded-xl p-5 h-[700px]">

        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 650 }}
       
          views={["month", "week", "day", "agenda"]}

          view={view}
          onView={(newView) => setView(newView)}
          
          date={currentDate}
          onNavigate={(date) => setCurrentDate(date)}

          toolbar
          popup
          selectable


          onSelectEvent={(event) => {
            setSelectedEvent(event.resource);
          }}

          eventPropGetter={(event) => {
            let backgroundColor = "#2563eb";

            switch (event.resource.eventType) {
              case "Wedding":
                backgroundColor = "#db2777";
                break;
              case "Birthday":
                backgroundColor = "#2563eb";
                break;
              case "House Opening":
                backgroundColor = "#ea580c";
                break;
              case "Reception":
                backgroundColor = "#9333ea";
                break;
              case "Engagement":
                backgroundColor = "#16a34a";
                break;
              default:
                backgroundColor = "#475569";
            }

            return {
              style: {
                backgroundColor,
                borderRadius: "8px",
                color: "white",
                border: "none",
              },
            };
          }}
        />

      </div>
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

          <div className="bg-slate-900 w-[500px] rounded-xl p-6">

            <div className="flex justify-between items-center">

              <h2 className="text-2xl font-bold text-white">
                {selectedEvent.title}
              </h2>

              <button
                onClick={() => setSelectedEvent(null)}
                className="text-white text-2xl"
              >
                ✕
              </button>

            </div>

            <div className="mt-5 space-y-3 text-gray-300">

              <p>
                🎉 <b>Event :</b> {selectedEvent.eventType}
              </p>

              <p>
                📅 <b>Date :</b>{" "}
                {new Date(selectedEvent.date).toLocaleDateString()}
              </p>

              <p>
                🕒 <b>Time :</b>{" "}
                {selectedEvent.shootTime || "-"}
              </p>

              <p>
                📍 <b>Venue :</b>{" "}
                {selectedEvent.location || "-"}
              </p>

              <p>
                📷 <b>Photographer :</b>{" "}
                {selectedEvent.photographer || "-"}
              </p>

              <p>
                🎥 <b>Videographer :</b>{" "}
                {selectedEvent.videographer || "-"}
              </p>

              <p>
                🚁 <b>Drone :</b>{" "}
                {selectedEvent.droneOperator || "-"}
              </p>

              <div className="mt-3">

                <span
                  className={`px-4 py-2 rounded-full text-white font-semibold ${
                    selectedEvent.status === "Completed"
                      ? "bg-green-600"
                      : selectedEvent.status === "In Progress"
                      ? "bg-yellow-600"
                      : selectedEvent.status === "Cancelled"
                      ? "bg-red-600"
                      : "bg-blue-600"
                  }`}
                >
                  {selectedEvent.status}
                </span>

              </div>
              <div className="flex flex-wrap gap-3 mt-6">

                {selectedEvent.phone && (
                  <a
                    href={`tel:${selectedEvent.phone}`}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
                  >
                    📞 Call
                  </a>
                )}

                {selectedEvent.phone && (
                  <a
                    href={`https://wa.me/91${selectedEvent.phone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white"
                  >
                    💬 WhatsApp
                  </a>
                )}

                {selectedEvent.googleMapLink && (
                  <a
                    href={selectedEvent.googleMapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-white"
                  >
                    📍 Google Maps
                  </a>
                )}

                <button
                  onClick={() => navigate(`/clients/${selectedEvent.clientId}`)}
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white"
                >
                  👁 View Client
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </Layout>

  );
}

export default CalendarPage;