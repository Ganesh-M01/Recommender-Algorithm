const Event = require("../models/event");
const mongoose = require("mongoose");

// Assign weights to different actions
const EVENT_WEIGHTS = {
  view: 1,
  search: 2,
  add_to_cart: 3,
  purchase: 5,
};

// Track user events
const trackEvent = async (req, res) => {
  try {
    console.log("Query Params:", req.query);
    console.log("Request Body:", req.body);
    console.log("Route Params:", req.params);
    console.log("Headers:", req.headers);

    const { product_id } = req.query;  // Or req.body, depending on how frontend sends data
    console.log("Extracted product_id:", product_id);
    
    console.log("Received event data:", req.body || req.query);
    const { userId, productId, eventType } = req.body;

    if (!userId || !productId || !eventType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!EVENT_WEIGHTS[eventType]) {
      return res.status(400).json({ error: "Invalid event type" });
    }

    // Ensure productId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const event = new Event({
      userId,
      productId: new mongoose.Types.ObjectId(productId), // Convert to ObjectId
      eventType,
      weight: EVENT_WEIGHTS[eventType],
    });

    await event.save();
    res.status(201).json({ message: "Event tracked successfully", event });
  } catch (error) {
    console.error("Error tracking event:", error);
    res.status(500).json({ error: "Error tracking event" });
  }
};

// Remove event when a product is removed from the cart
const removeEvent = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const deletedEvent = await Event.findOneAndDelete({
      userId,
      productId,
      eventType: "add_to_cart",
    });

    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({ message: "Event removed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error removing event" });
  }
};

// Get all events for analytics
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("userId productId");
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Error fetching events" });
  }
};

module.exports = { trackEvent, removeEvent, getEvents };
