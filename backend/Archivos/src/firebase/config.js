const firebase = require('firebase');

const firebaseConfig = {
    apiKey: "AIzaSyD5Uy4EJXuBcbIiuiuBJmEJojy_rE_0-6k",
    authDomain: "analisis2-f19a0.firebaseapp.com",
    projectId: "analisis2-f19a0",
    storageBucket: "analisis2-f19a0.appspot.com",
    messagingSenderId: "716287806126",
    appId: "1:716287806126:web:0c96afa695a5b489cd7b3f",
    measurementId: "G-G3F8DB75BH"
};

firebase.initializeApp(firebaseConfig);

module.exports = firebase;