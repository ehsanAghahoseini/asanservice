importScripts('https://www.gstatic.com/firebasejs/7.23.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.23.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey:  "AIzaSyCK-YlyTIHMlKxMGw-7WQE_SZLHfXy4Jr4",
    authDomain: "smaa-48ace.firebaseapp.com",
    databaseURL: "https://smaa-48ace.firebaseio.com",
    projectId: "smaa-48ace",
    storageBucket: "smaa-48ace.appspot.com",
    messagingSenderId: "937115180792",
    appId:"1:937115180792:web:3fae0e68359f82de7ca50d",
    measurementId: "G-MJP2LCCENY"
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log("back firebase");
    // console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = 'یک اعلان جدید از طرف بامینو';
    const notificationOptions = {
        body: payload.data.method
    };
    return self.registration.showNotification(notificationTitle,
        notificationOptions.body
    );
}
);