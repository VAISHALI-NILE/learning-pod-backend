// backend/firebaseAdmin.js
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json"); // Path to your service account JSON

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // Use environment variable
});

const bucket = admin.storage().bucket();

module.exports = { bucket };
