const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  eventType: {
    type: String,
    enum: ["view", "search", "add_to_cart", "purchase"],
  },
  weight: { type: Number },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Event", EventSchema);
