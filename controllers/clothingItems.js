const clothingSchema = require("../models/clothingItems");
const { handleError, NotFoundError } = require("../utils/errors");
const mongoose = require("mongoose");

const getItems = (req, res) => {
  clothingSchema
    .find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((error) => {
      console.error(error);
      handleError(error, req, res);
    });
};

const createItem = (req, res) => {
  console.log("Request body:", req.body);
  console.log(req.user._id);
  const { name, weather, imageUrl } = req.body;
  if (!name || !weather || !imageUrl) {
    const error = new Error("All fields are required");
    error.name = "ValidationError";
    handleError(error, req, res);
  } else {
    clothingSchema
      .create({ name, weather, imageUrl, owner: req.user._id })
      .then((item) => {
        res.status(201).send(item);
      })
      .catch((error) => {
        console.error(error);
        handleError(error, req, res);
      });
  }
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).send({ message: "Invalid item ID" });
  }
  if (!req.user || !req.user._id) {
    return res.status(401).send({ message: "Unauthorized: User not found" });
  }
  if (!itemId) {
    return res.status(400).send({ message: "Item ID is required" });
  }

  clothingSchema
    .findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      if (item.owner.toString() !== req.user._id) {
        return res.status(403).send({ message: "Forbidden: Not your item" });
      }
      return clothingSchema.findByIdAndRemove(itemId).then((deleted) => {
        res.send(deleted);
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Internal Server Error" });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  clothingSchema
    .findByIdAndUpdate(itemId, { $addToSet: { likes: userId } }, { new: true })
    .orFail()
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((error) => {
      console.error(error);
      handleError(error, req, res);
    });
};

const deleteLike = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  clothingSchema
    .findByIdAndUpdate(itemId, { $pull: { likes: userId } }, { new: true })
    .orFail()
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((error) => {
      console.error(error);
      handleError(error, req, res);
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, deleteLike };
