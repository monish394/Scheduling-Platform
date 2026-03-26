import Notification from '../model/notificationModel.js';

const notificationCtrl = {

  getNotifications: async (req, res) => {
    try {
      const userId = req.user._id;

      const notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .limit(10);

      res.status(200).json(notifications);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

markAsRead: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      await Notification.findOneAndUpdate({ _id: id, userId }, { isRead: true });

      res.status(200).json({ message: "Notification read." });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

ReadAll: async (req, res) => {
    try {
      const userId = req.user._id;
      await Notification.updateMany({ userId }, { isRead: true });
      res.status(200).json({ message: "All notifications read." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
  }
};

export default notificationCtrl;
