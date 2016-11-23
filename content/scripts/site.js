const messaging = firebase.messaging();

function requestNotificationPermission() {
    if (Notification.requestPermission) {
        Notification.requestPermission(function(result) {
            console.log("Notification: ", result);
        });
    } else {
        console.log("Notifications supported by this browser.");
    }
}

function registerForPush() {
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
            serviceWorkerRegistration.pushManager.subscribe({
                userVisibleOnly: true
            }).then(function(subscription) {
                console.log("Subscription Push successful: ", subscription.endpoint);
            }).catch(function(error) {
                console.log("Subscription Push failed", error);
            });

            messaging.requestPermission().then(function() {
                console.log('Notification permission granted.');
            
                messaging.getToken().then(function(currentToken) {
                    if (currentToken) {
                        //sendTokenToServer(currentToken);
                        //updateUIForPushEnabled(currentToken);
                    } else {
                        // Show permission request.
                        console.log('No Instance ID token available. Request permission to generate one.');
                        // Show permission UI.
                        //updateUIForPushPermissionRequired();
                        //setTokenSentToServer(false);
                    }
                }).catch(function(err) {
                    console.log('An error occurred while retrieving token. ', err);
                    //showToken('Error retrieving Instance ID token. ', err);
                    //setTokenSentToServer(false);
                });
            }).catch(function(err) {
                console.log('Unable to get permission to notify.', err);
            });
        });
    } else {
        console.log("No Service Worker");
    }
}

function doNotificationSetup() {
    if($("#chkBrowserNotification").is(':checked')) {
        requestNotificationPermission();
        registerForPush();
    }

    return false;
}

// Callback fired if Instance ID token is updated.
messaging.onTokenRefresh(function() {
  messaging.getToken()
  .then(function(refreshedToken) {
    console.log('Token refreshed.');
    // Indicate that the new Instance ID token has not yet been sent to the
    // app server.
    setTokenSentToServer(false);
    // Send Instance ID token to app server.
    sendTokenToServer(refreshedToken);
    // ...
  })
  .catch(function(err) {
    console.log('Unable to retrieve refreshed token ', err);
    //showToken('Unable to retrieve refreshed token ', err);
  });
});