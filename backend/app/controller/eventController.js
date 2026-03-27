import Event from '../model/eventModel.js';

const eventCtrl = {

  createEvent: async (req, res) => {
    try {
      const { title, duration, description } = req.body;
      const userId = req.user._id;

      if (!title || !duration) {
        return res.status(400).json({ message: "Title and duration are required." });
      }

const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

const newEvent = new Event({
        userId,
        title,
        duration,
        slug,
        description,
      });

      await newEvent.save();

      res.status(201).json({
        message: "Event created successfully!",
        event: newEvent
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

getEvents: async (req, res) => {
    try {
      const userId = req.user._id;
      const events = await Event.find({ userId }).sort({ createdAt: -1 });
      res.status(200).json(events);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

deleteEvent: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const event = await Event.findOneAndDelete({ _id: id, userId });
      if (!event) return res.status(404).json({ message: "Event not found." });

      res.status(200).json({ message: "Event deleted successfully." });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  updateEvent: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, duration, description } = req.body;
      const userId = req.user._id;

      let event = await Event.findOne({ _id: id, userId });
      if (!event) return res.status(404).json({ message: "Event not found." });

      if (title && title !== event.title) {
        event.title = title;
        event.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      }

      if (duration) event.duration = duration;
      if (description !== undefined) event.description = description;

      await event.save();

      res.status(200).json({
        message: "Event updated successfully!",
        event
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

export default eventCtrl;
