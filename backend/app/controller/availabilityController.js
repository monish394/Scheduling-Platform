import Availability from '../model/availabilityModel.js';

const availabilityCtrl = {

  setAvailability: async (req, res) => {
    try {
      const availabilityData = req.body;
      const userId = req.user._id;

      if (!Array.isArray(availabilityData)) {
        return res.status(400).json({ message: "Invalid data format. Expected an array." });
      }

await Availability.deleteMany({ userId });

      const newAvailability = availabilityData.map(item => ({
        ...item,
        userId
      }));

      await Availability.insertMany(newAvailability);

      res.status(200).json({ message: "Availability updated successfully!" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

getAvailability: async (req, res) => {
    try {
      const userId = req.user._id;
      const availability = await Availability.find({ userId });

res.status(200).json(availability);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

export default availabilityCtrl;
