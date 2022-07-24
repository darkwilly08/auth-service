const admin = require('firebase-admin');
const serviceAccount = require('../' + process.env.firebase_json);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.firebase_db,
  storageBucket: process.env.firebase_storage,
});
module.exports = {
  auth: admin.auth(),
  db: admin.database(),
  firebaseStorage: admin.storage(),
};
