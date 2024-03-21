/**
 * Show notification
 */
function showNotification(message, callback = hideNotification) {
    notificationContainer.innerHTML = message;
    notificationContainer.style.display = "initial";
    callback();
}

/**
 * Hide notification
 */
function hideNotification(duration = 2000) {
    setTimeout(() => {
        notificationContainer.innerHTML = "";
        notificationContainer.style.display = "none";
    }, duration)
}