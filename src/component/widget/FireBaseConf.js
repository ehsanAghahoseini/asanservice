import React from 'react';
import app from 'firebase/app';
import * as firebase from "firebase";

export default  function FireBaseConf() {


     const config = {
      apiKey: "AIzaSyCK-YlyTIHMlKxMGw-7WQE_SZLHfXy4Jr4",
      authDomain: "smaa-48ace.firebaseapp.com",
      databaseURL: "https://smaa-48ace.firebaseio.com",
      projectId: "smaa-48ace",
      storageBucket: "smaa-48ace.appspot.com",
      messagingSenderId: "937115180792",
      appId: "1:937115180792:web:3fae0e68359f82de7ca50d",
      measurementId: "G-MJP2LCCENY"
    };
    if (firebase.apps.length === 0) {
        app.initializeApp(config);
    }
    const messaging = firebase.messaging();
    Notification.requestPermission()
    .then(function () {
          return messaging.getToken();
    })
    .then(function (tokenFire) {
      console.log("fire token received");
      console.log(tokenFire);


    // $.ajax({
    //   url: BASE_URL + '/post_token.php',
    //   type: 'post',
    //   dataType: 'json',
    //   data: JSON.stringify({
    //     "username":localStorage.getItem("username") ,
    //     "password":localStorage.getItem("password"),
    //     "token": tokenFire
    //   }),
    //   success: (res) =>  {
    //       if(res.result === "ok"){
    //         // console.log("fireeeeeeeeeeeeeeee")
    //       }
    //   },
    // });   
    })
    .catch(function (err) {
      console.log('Error Occurred.' + err);
    });
    messaging.onMessage((payload) => {
      console.log(payload);
    });

    return (
     <>
     
     </>
    );
}

