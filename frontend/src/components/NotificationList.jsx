import { useEffect, useState } from "react";
import api from "../services/api";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/api/users/notifications");
        setNotifications(response.data.notifications ?? []);
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(`/api/users/notifications/${id}/read`);
      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === id
            ? { ...notification, isRead: true }
            : notification,
        ),
      );
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  if (notifications.length === 0) return null;

  return (
    <section className="rounded-xl bg-white p-6 text-left shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Notifications</h2>

      <ul className="mt-4 space-y-3">
        {notifications.map((notification) => (
          <li
            key={notification._id}
            className={`rounded-lg p-3 text-sm ${
              notification.isRead ? "bg-slate-50" : "bg-blue-50"
            }`}
          >
            <p className="text-slate-800">{notification.message}</p>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
              <span>{new Date(notification.createdAt).toLocaleString()}</span>
              {!notification.isRead && (
                <button
                  onClick={() => handleMarkAsRead(notification._id)}
                  className="font-medium text-blue-600 hover:text-blue-800"
                >
                  Mark as read
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default NotificationList;