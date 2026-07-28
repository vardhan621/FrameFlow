import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import socket from "../../socket";

import {
  FiBell,
  FiDollarSign,
  FiCamera,
  FiEdit,
  FiTruck,
  FiUser,
  FiTrash2,
  FiBookOpen,
  FiUpload,
  FiX,
} from "react-icons/fi";

import { formatDistanceToNow } from "date-fns";

function NotificationBell() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);

  // ================= POPUP =================

  const [toast, setToast] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const bellRef = useRef(null);

  // ================= FETCH =================

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notification");

      setNotifications(res.data.notifications || []);
      setUnread(res.data.unreadCount || 0);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= INITIAL =================

  useEffect(() => {
    console.log("🔥 NotificationBell Mounted");

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  // ================= SOCKET JOIN =================

  useEffect(() => {
    const studio = JSON.parse(localStorage.getItem("studio"));

    if (!studio) return;

    const studioId = studio.id || studio._id;

    const joinRoom = () => {
      console.log("Joining Room:", studioId);

      socket.emit("joinStudio", studioId);
    };

    if (socket.connected) {
      joinRoom();
    }

    socket.on("connect", joinRoom);

    return () => {
      socket.off("connect", joinRoom);
    };
  }, []);

  // ================= RECEIVE NOTIFICATION =================

  useEffect(() => {
    const receiveNotification = (notification) => {
      console.log("🔔 Notification Received", notification);

      // Refresh Bell
      fetchNotifications();

      // Popup
      setToast(notification);
      setShowToast(true);

      // Auto Close
      setTimeout(() => {
        setShowToast(false);
      }, 4000);

      // Sound
      const audio = new Audio("/notification.wav");

      audio.volume = 1;

      audio.play().then(() => {
        console.log("✅ Sound Played");
      }).catch((err) => {
        console.log(err);
      });
    };

    socket.on("newNotification", receiveNotification);

    return () => {
      socket.off("newNotification", receiveNotification);
    };
  }, []);

  // ================= OUTSIDE CLICK =================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        bellRef.current &&
        !bellRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ================= MARK ALL =================

  const markAllRead = async () => {
    try {
      await API.put("/notification/read-all");

      fetchNotifications();
    } catch (err) {
      console.log(err);
    }
  };

  // ================= CLEAR =================

  const clearAllNotifications = async () => {
    try {
      await API.delete("/notification/clear");

      setNotifications([]);
      setUnread(0);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= DELETE =================

  const deleteNotification = async (id) => {
    try {
      await API.delete(`/notification/${id}`);

      fetchNotifications();
    } catch (err) {
      console.log(err);
    }
  };

  // ================= ICON =================

  const getIcon = (type) => {
    switch (type) {
      case "payment":
        return <FiDollarSign className="text-green-500 text-xl" />;

      case "editing":
        return <FiEdit className="text-orange-500 text-xl" />;

      case "delivery":
        return <FiTruck className="text-yellow-500 text-xl" />;

      case "client":
        return <FiUser className="text-blue-500 text-xl" />;

      case "album":
        return <FiBookOpen className="text-pink-500 text-xl" />;

      case "upload":
        return <FiUpload className="text-cyan-500 text-xl" />;

      case "expense":
        return <FiDollarSign className="text-red-500 text-xl" />;

      default:
        return <FiCamera className="text-purple-500 text-xl" />;
    }
  };

  // ================= CLICK =================

  const handleNotificationClick = async (item) => {
    try {
      if (!item.isRead) {
        await API.put(`/notification/${item._id}/read`);
      }

      fetchNotifications();

      setOpen(false);

      switch (item.type) {
        case "payment":
          navigate("/payments");
          break;

        case "expense":
          navigate("/expenses");
          break;

        case "leave":
          navigate("/leave");
          break;

        case "task":
          navigate("/tasks");
          break;

        case "upload":
          navigate("/gallery");
          break;

        default:
          if (item.client?._id) {
            navigate(`/clients/${item.client._id}`);
          } else {
            navigate("/dashboard");
          }
      }
    } catch (err) {
      console.log(err);
    }
  };
    // ================= UI =================

  return (
    <>
      {/* ================= TOAST POPUP ================= */}

      {showToast && toast && (
        <div className="fixed top-5 right-5 w-96 bg-[#111827] border border-gray-700 rounded-xl shadow-2xl z-[99999] overflow-hidden">

          <div className="flex items-start gap-4 p-4">

            <div>
              {getIcon(toast.type)}
            </div>

            <div
              className="flex-1 cursor-pointer"
              onClick={() => {
                setShowToast(false);
                setOpen(true);
              }}
            >
              <h3 className="text-white font-semibold">
                {toast.title}
              </h3>

              <p className="text-gray-300 text-sm mt-1">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => setShowToast(false)}
              className="text-gray-400 hover:text-white"
            >
              <FiX />
            </button>

          </div>

          <div className="h-1 bg-blue-500" />

        </div>
      )}

      {/* ================= BELL ================= */}

      <div
        className="relative z-[9999]"
        ref={bellRef}
      >
        <button
          onClick={() => setOpen(!open)}
          className="relative text-white text-2xl"
        >
          <FiBell />

          {unread > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {unread}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 top-12 w-96 max-h-[500px] bg-[#111827] border border-gray-700 rounded-xl shadow-xl z-[9999]">

            <div className="flex justify-between items-center p-4 border-b border-gray-700">

              <h2 className="text-white font-semibold">
                Notifications
              </h2>

              <div className="flex gap-4">

                <button
                  onClick={markAllRead}
                  className="text-blue-400 text-sm"
                >
                  Mark All Read
                </button>

                <button
                  onClick={clearAllNotifications}
                  className="text-red-400 text-sm"
                >
                  Clear All
                </button>

              </div>

            </div>

            <div className="max-h-96 overflow-y-auto">

              {notifications.length === 0 ? (

                <div className="flex flex-col items-center justify-center py-10">

                  <FiBell className="text-5xl text-gray-600 mb-3" />

                  <p className="text-gray-400">
                    No notifications yet
                  </p>

                </div>

              ) : (

                notifications.map((item) => (

                  <div
                    key={item._id}
                    onClick={() => handleNotificationClick(item)}
                    className={`cursor-pointer flex gap-4 p-4 border-b border-gray-700 hover:bg-gray-700 transition ${
                      item.isRead
                        ? ""
                        : "bg-gray-800"
                    }`}
                  >

                    <div>
                      {getIcon(item.type)}
                    </div>

                    <div className="flex-1">

                      <div className="flex items-center gap-2">

                        {!item.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}

                        <h3 className="text-white font-semibold">
                          {item.title}
                        </h3>

                      </div>

                      <p className="text-gray-400 text-sm mt-1">
                        {item.message}
                      </p>

                      <p className="text-xs text-gray-500 mt-2">
                        {formatDistanceToNow(
                          new Date(item.createdAt),
                          {
                            addSuffix: true,
                          }
                        )}
                      </p>

                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(item._id);
                      }}
                      className="text-red-500 hover:text-red-400 p-2 rounded hover:bg-red-500/10 transition"
                    >
                      <FiTrash2 />
                    </button>

                  </div>

                ))

              )}

            </div>

          </div>
        )}

      </div>
    </>
  );
}

export default NotificationBell;