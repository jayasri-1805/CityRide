import db from "../utils/firebase.js";

export const addVehicle = async (req, res) => {
  try {
    const { vehicleNumber } = req.body;

    const vehicleRef = await db.collection("vehicles").add({
      driverEmail: req.user.email,
      vehicleNumber,
      currentLocation: null,
      status: "inactive",
    });

    res.json({ id: vehicleRef.id, driverEmail: req.user.email, vehicleNumber, status: "inactive" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateLocation = async (req, res) => {
  try {
    const { vehicleId, lat, lng } = req.body;

    const vehicleRef = db.collection("vehicles").doc(vehicleId);
    await vehicleRef.update({
      currentLocation: { lat, lng },
      status: "active",
    });

    const updatedDoc = await vehicleRef.get();
    res.json(updatedDoc.data());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getVehicles = async (req, res) => {
  try {
    const snapshot = await db.collection("vehicles").get();
    const vehicles = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

