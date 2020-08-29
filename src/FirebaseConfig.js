import * as firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyDYxaX9DwCNBMX1V8BxTdcODCrH0tuPPcI",
    authDomain: "totalenergy2020.firebaseapp.com",
    databaseURL: "https://totalenergy2020.firebaseio.com",
    projectId: "totalenergy2020",
    storageBucket: "totalenergy2020.appspot.com",
    messagingSenderId: "805996200310",
    appId: "1:805996200310:web:0d216c84dac61a43297a57",
    measurementId: "G-8C2EKEFPES"
  };
  var fireconfig=firebase.initializeApp(firebaseConfig);

 export default fireconfig;