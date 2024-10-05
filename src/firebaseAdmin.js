// backend/firebaseAdmin.js
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json"); // Path to your service account JSON

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "learning-pod-9a1c8.appspot.com", // Your Firebase Storage bucket name
});

const bucket = admin.storage().bucket();

module.exports = { bucket };
