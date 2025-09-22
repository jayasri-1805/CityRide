import db from "../utils/firebase.js";

export const getProfile = async (req, res) => {
  try {
    const userRef = db.collection("users").doc(req.user.email);
    const userDoc = await userRef.get();

    if (!userDoc.exists) return res.status(404).json({ error: "User not found" });

    const { name, email, role } = userDoc.data();
    res.json({ name, email, role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

