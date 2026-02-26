export const showNotification = (title, message) => {
  // Generate a unique ID for the notification
  const notificationId = `notification_${Date.now()}`;
  
  // Create the notification
  chrome.notifications.create(notificationId, {
    type: 'basic',
    iconUrl: '/asset/images/coraAIicon.png',
    title: title,
    message: message,
    priority: 2
  });
  
  // Automatically clear the notification after 3 seconds
  setTimeout(() => {
    chrome.notifications.clear(notificationId);
  }, 3000);
};