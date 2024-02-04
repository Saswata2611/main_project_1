const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-firebase-project-id.firebaseio.com',
});

const db = admin.firestore();
const storage = admin.storage().bucket('first-login-register.appspot.com');
module.exports = { db , storage, admin};