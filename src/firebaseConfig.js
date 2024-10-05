// src/firebaseConfig.js
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "learning-pod-9a1c8.appspot.com",
  });
}

const bucket = admin.storage().bucket();

module.exports = { admin, bucket };
