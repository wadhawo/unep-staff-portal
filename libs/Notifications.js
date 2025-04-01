if ('Notification' in window) {
    console.log("[Notifications]: ", Notification.permission);

    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            console.log("Notifications permission granted!");
        }else{ Notification.requestPermission(); }
    });
}

function requestPermission() {
  if (!('Notification' in window)) {
    alert('Notification API not supported!');
    return;
  }
  
  Notification.requestPermission(function (result) {
        console.log("Notification Permission", result);
  });
}

function nonPersistentNotification(msg) {
  if (!('Notification' in window)) {
    alert('Notification API not supported!');
    return;
  }
  
  try {
    var notification = new Notification(msg);
  } catch (err) {
    alert('Notification API error: ' + err);
  }
}

function persistentNotification(msg) {
        if (!('Notification' in window) || !('ServiceWorkerRegistration' in window)) {
            alert('Persistent Notification API not supported!');
            return;
        }
        
        try {
            navigator.serviceWorker.getRegistration()
            .then((reg) => reg.showNotification(msg))
            .catch((err) => alert('Service Worker registration error: ' + err));
        } catch (err) {
            alert('Notification API error: ' + err);
  }
}
