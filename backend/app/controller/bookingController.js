import Booking from '../model/bookingModel.js';
import Event from '../model/eventModel.js';

const bookingCtrl = {

  getBookings: async (req, res) => {
    try {
      const userId = req.user._id;

const bookings = await Booking.find({ userId })
        .populate('eventId', 'title duration slug')
        .sort({ startTime: 1 });

      res.status(200).json(bookings);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

getStats: async (req, res) => {
    try {
      const userId = req.user._id;
      const now = new Date();

const startOfDay = new Date(now.setHours(0,0,0,0));
      const endOfDay = new Date(now.setHours(23,59,59,999));

      const todayMeetings = await Booking.countDocuments({
        userId,
        startTime: { $gte: startOfDay, $lte: endOfDay },
        status: 'confirmed'
      });

const totalBookings = await Booking.countDocuments({ userId });

const upcomingCount = await Booking.countDocuments({
        userId,
        startTime: { $gt: new Date() },
        status: 'confirmed'
      });

const confirmedBookings = await Booking.find({ userId, status: 'confirmed' }).populate('eventId');
      const totalMinutes = confirmedBookings.reduce((acc, curr) => acc + (curr.eventId?.duration || 0), 0);
      const meetingHours = (totalMinutes / 60).toFixed(1);

      res.status(200).json({
        todayMeetings,
        upcomingCount,
        totalBookings,
        meetingHours
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user._id;

      const booking = await Booking.findOneAndUpdate(
        { _id: id, userId },
        { status },
        { new: true }
      );

      if (!booking) return res.status(404).json({ message: "Booking not found." });

      res.status(200).json({ message: `Booking ${status} successfully.`, booking });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

export default bookingCtrl;
