import { useEffect, useState } from "react";
import { getProjectActivities } from "../../services/activityService";
import { formatDistanceToNow } from "date-fns";
import {
  Upload,
  Download,
  Trash2,
  RotateCcw,
  Archive,
  Pencil,
  FileText,
} from "lucide-react";

function ActivityTimeline({ projectId }) {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (projectId) {
      loadActivities();

      const interval = setInterval(loadActivities, 10000);

      return () => clearInterval(interval);
    }
  }, [projectId]);

  const loadActivities = async () => {
    try {
      const res = await getProjectActivities(projectId);
      setActivities(res.data.activities);
    } catch (err) {
      console.error(err);
    }
  };

  const getActivityDetails = (title) => {
    switch (title) {
      case "File Uploaded":
        return {
          icon: <Upload className="w-5 h-5 text-green-600" />,
          bg: "bg-green-100",
        };

      case "File Downloaded":
        return {
          icon: <Download className="w-5 h-5 text-blue-600" />,
          bg: "bg-blue-100",
        };

      case "ZIP Download":
        return {
          icon: <Archive className="w-5 h-5 text-purple-600" />,
          bg: "bg-purple-100",
        };

      case "Moved to Trash":
      case "Trash Emptied":
      case "File Permanently Deleted":
        return {
          icon: <Trash2 className="w-5 h-5 text-red-600" />,
          bg: "bg-red-100",
        };

      case "Restore All":
      case "File Restored":
        return {
          icon: <RotateCcw className="w-5 h-5 text-orange-600" />,
          bg: "bg-orange-100",
        };

      case "File Renamed":
        return {
          icon: <Pencil className="w-5 h-5 text-yellow-600" />,
          bg: "bg-yellow-100",
        };

      default:
        return {
          icon: <FileText className="w-5 h-5 text-gray-600" />,
          bg: "bg-gray-100",
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          Recent Activity
        </h2>

        <span className="text-sm text-gray-500">
          {activities.length} Activities
        </span>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="mx-auto w-14 h-14 text-gray-300 mb-3" />

          <h3 className="text-lg font-semibold text-gray-600">
            No Activity Yet
          </h3>

          <p className="text-gray-400 mt-2">
            Upload your first file to start tracking project activity.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {activities.map((activity) => {
            const style = getActivityDetails(activity.title);

            return (
              <div
                key={activity._id}
                className="flex gap-4 hover:bg-gray-50 rounded-xl p-3 transition-all duration-200"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`${style.bg} p-3 rounded-full shadow-sm`}
                  >
                    {style.icon}
                  </div>

                  <div className="w-[2px] flex-1 bg-gray-200 mt-2"></div>
                </div>

                <div className="flex-1 pb-3">
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {activity.title}
                  </h3>

                  <p className="text-gray-600 mt-1">
                    {activity.message}
                  </p>

                  <div className="flex items-center gap-3 mt-3 text-sm text-gray-400">
                    <span>
                      🕒{" "}
                      {formatDistanceToNow(
                        new Date(activity.createdAt),
                        { addSuffix: true }
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ActivityTimeline;