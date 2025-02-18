"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
var _product = require("../../models/product");
var _product2 = _interopRequireDefault(_product);
var _boom = require("boom");
var _boom2 = _interopRequireDefault(_boom);
var _validations = require("./validations");
var _validations2 = _interopRequireDefault(_validations);
const mongoose = require("mongoose");
var _event = require("../../models/event"); // Import Event model
var _event2 = _interopRequireDefault(_event);

const Create = async (req, res, next) => {
  const input = req.body;
  const { error } = _validations2.default.validate(input);

  if (error) {
    return next(_boom2.default.badRequest(error.details[0].message));
  }

  try {
    input.photos = JSON.parse(input.photos);

    const product = new (0, _product2.default)(input);
    const savedData = await product.save();

    res.json(savedData);
  } catch (e) {
    next(e);
  }
};

const Get = async (req, res, next) => {
  const { product_id } = req.params;
  console.log("Received product_id:", product_id);

  // Handle search case
  if (product_id === "search") {
    try {
      // Perform search logic here
      const searchResults = await searchProducts(req.query); // Replace with your search function
      const normalizedResults = searchResults.map(normalizeProduct); // Normalize search results
      return res.json(normalizedResults);
    } catch (e) {
      return next(e);
    }
  }

  // Validate product_id
  if (!product_id || !mongoose.isValidObjectId(product_id)) {
    return next(_boom2.default.badRequest("Invalid or missing parameter (:product_id)"));
  }

  // Fetch product by ID
  try {
    const product = await _product2.default.findById(product_id);
    if (!product) {
      return next(_boom2.default.notFound("Product not found"));
    }

    // Normalize the product data
    const normalizedProduct = normalizeProduct(product);
    return res.json(normalizedProduct);
  } catch (e) {
    return next(e);
  }
};

// Helper function to normalize product data
const normalizeProduct = (product) => {
  return {
    _id: product._id.toString(), // Convert ObjectId to string
    title: product.title,
    description: product.description,
    price: product.price,
    photos: product.photos,
    createdAt: product.createdAt, // Use the Date object directly
    __v: product.__v,
  };
};

const Update = async (req, res, next) => {
  const { product_id } = req.params;

  try {
    const updated = await _product2.default.findByIdAndUpdate(
      product_id,
      req.body,
      {
        new: true,
      }
    );

    res.json(updated);
  } catch (e) {
    next(e);
  }
};

const Delete = async (req, res, next) => {
  const { product_id } = req.params;
  console.log("Received product_id:", product_id);

  if (!product_id || !mongoose.isValidObjectId(product_id)) {
    return next(
      _boom2.default.badRequest("Invalid or missing parameter (:product_id)")
    );
  }

  try {
    const deleted = await _product2.default.findByIdAndDelete(product_id);

    if (!deleted) {
      throw _boom2.default.badRequest("Product not found.");
    }

    res.json(deleted);
  } catch (e) {
    next(e);
  }
};

const limit = 12;
const GetList = async (req, res, next) => {
  let { page } = req.query;

  if (page < 1) {
    page = 1;
  }

  const skip = (parseInt(page) - 1) * limit;

  try {
    const products = await _product2.default
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(products);
  } catch (e) {
    next(e);
  }
};

const searchProducts = async (query) => {
  const { q } = query; // Extract search query
  if (!q) {
    return []; // Return empty array if no query is provided
  }

  // Perform a case-insensitive search on title
  return await _product2.default.find(
    { title: { $regex: q, $options: "i" } }, // Case-insensitive search in title
    { title: 1 } // Return only the title field
  );
};

const GetByID = async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ error: "Invalid product IDs" });
    }

    const products = await _product2.default.find({ _id: { $in: productIds } });
    res.json(products);
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ error: "Server error" });
  }
}

const Search = async (req, res) => {
  try {
    const query = req.query.q;
    console.log("Received search query:", query); // Debugging line
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const products = await _product2.default.find({
      name: { $regex: query, $options: "i" },
    }).limit(10);

    // Track the search event
    const userId = req.headers["user-id"]; // Assuming user ID is passed in headers
    if (userId) {
      const event = new (_event2.default)({
        userId,
        productId: null, // No specific product ID for search
        eventType: "search",
        weight: 2,
      });
      await event.save();
    }

    res.json(products);
  } catch (error) {
    console.error("Error searching for products:", error); // Debugging line
    res.status(500).json({ error: "Error searching for products" });
  }
};

exports.default = {
  Create,
  Get,
  Update,
  Delete,
  GetList,
  searchProducts,
  Search,
  GetByID,
};
