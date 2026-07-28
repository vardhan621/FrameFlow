import {
  FaFolderOpen,
  FaImages,
  FaVideo,
  FaDatabase,
} from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
export default function StatsCards({ files }) {
  const { theme } = useTheme();

  const totalFiles = files.length;

  const imageCount = files.filter((file) =>
    file.category.includes("Images")
  ).length;

  const videoCount = files.filter((file) =>
    file.category.includes("Videos")
  ).length;

  const totalStorage = files.reduce(
    (sum, file) => sum + (file.fileSize || 0),
    0
  );

  const storageMB = (totalStorage / 1024 / 1024).toFixed(2);

  const cards = [
    {
      title: "Total Files",
      value: totalFiles,
      icon: <FaFolderOpen />,
      color: "bg-blue-500",
    },
    {
      title: "Images",
      value: imageCount,
      icon: <FaImages />,
      color: "bg-green-500",
    },
    {
      title: "Videos",
      value: videoCount,
      icon: <FaVideo />,
      color: "bg-purple-500",
    },
    {
      title: "Storage",
      value: `${storageMB} MB`,
      icon: <FaDatabase />,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border ${
            theme === "dark"
              ? "bg-[#111827] border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <p
                className={`text-sm ${
                  theme === "dark"
                    ? "text-gray-400"
                    : "text-gray-600"
                }`}
              >
                {card.title}
              </p>

              <h2
                className={`text-3xl font-bold mt-2 ${
                  theme === "dark"
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                {card.value}
              </h2>
            </div>

            <div
              className={`${card.color} text-white w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-md`}
            >
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}