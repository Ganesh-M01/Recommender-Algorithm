const express = require("express");
const router = express.Router();
const { trackEvent, removeEvent, getEvents } = require("../controllers/event");

router.post("/", trackEvent);  // Log user actions
router.delete("/", removeEvent);
router.get("/", getEvents);    // Retrieve stored event data

module.exports = router;
