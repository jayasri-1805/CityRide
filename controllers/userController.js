import db from "../utils/firebase.js";

export const getProfile = async (req, res) => {
  try {
    const userRef = db.collection("users").doc(req.user.email);
    const doc = await userRef.get();
    if (!doc.exists) return res.status(404).json({ message: "User not found" });
    const { password, ...data } = doc.data();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
