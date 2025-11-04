import { requestNotificationPerms, showNotification } from "@/src/notifications/useNotification";

export default function NotificationTest(){
	return(
      <div id="notification-container">
        <button
          id="notification-permission-button"
          onClick={() => requestNotificationPerms()}
        >
          Enable Notifications
        </button>
        <button
          id="show-notification-button"
          onClick={() => showNotification("Yes, it worked!")}
        >
          Show Notification
        </button>
      </div>	)
}