import admin from "firebase-admin";
import path from "path";

const serviceAccount = path.resolve("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export default db;

