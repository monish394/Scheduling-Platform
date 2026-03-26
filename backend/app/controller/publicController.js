import Event from '../model/eventModel.js';
import User from '../model/userModel.js';
import Booking from '../model/bookingModel.js';
import Notification from '../model/notificationModel.js';

const publicCtrl = {

  getPublicEvent: async (req, res) => {
    try {
      const { username, slug } = req.params;

      const user = await User.findOne({ username }).select('name username timezone');
      if (!user) return res.status(404).json({ message: "User not found." });

      const event = await Event.findOne({ userId: user._id, slug, isActive: true });
      if (!event) return res.status(404).json({ message: "Event not found or inactive." });

      res.status(200).json({
        user,
        event
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

createPublicBooking: async (req, res) => {
    try {
      const { userId, eventId, guestName, guestEmail, startTime, endTime } = req.body;

      if (!guestName || !guestEmail || !startTime || !endTime) {
        return res.status(400).json({ message: "Please fill all required fields." });
      }

const event = await Event.findById(eventId);
      if (!event) return res.status(404).json({ message: "Event type no longer available." });

      const booking = new Booking({
        userId,
        eventId,
        guestName,
        guestEmail,
        startTime,
        endTime
      });

      await booking.save();

const notification = new Notification({
        userId,
        message: `${guestName} booked your ${event.title}`,
        type: 'booking'
      });
      await notification.save();

      res.status(201).json({
        message: "Booking confirmed! ✨",
        booking
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

export default publicCtrl;
