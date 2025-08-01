const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json"); // Download from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "your-bucket-name.appspot.com" // if using storage
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { admin, db, bucket };
