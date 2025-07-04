const mongoose = require("mongoose");
const clothingSchema = require("../models/clothingItems");
const { handleError } = require("../utils/errors");
const {
  OK,
  BAD_REQUEST,
  CREATED,
  FORBIDDEN_REQUEST,
  FORBIDDEN,
} = require("../utils/statusCodes");

const getItems = (req, res) => {
  clothingSchema
    .find({})
    .then((items) => {
      res.status(OK).send(items);
    })
    .catch((error) => {
      console.error(error);
      return handleError(error, req, res);
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  if (!name || !weather || !imageUrl) {
    return res.status(BAD_REQUEST).send({ message: "All fields are required" });
  }
  return clothingSchema
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(CREATED).send(item);
    })
    .catch((error) => {
      console.error(error);
      return handleError(error, req, res);
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
  }
  return clothingSchema
    .findById(itemId)
    .then((item) => {
      if (!item) {
        return res
          .status(FORBIDDEN_REQUEST)
          .send({ message: "Item not found" });
      }
      if (!req.user || !req.user._id || !item.owner.equals(req.user._id)) {
        return res
          .status(FORBIDDEN)
          .send({ message: "You do not have permission to delete this item" });
      }
      return item.deleteOne().then(() => res.status(OK).send(item));
    })
    .catch((error) => {
      console.error(error);
      return handleError(error, req, res);
    });
};

const likeItem = (req, res) =>
  clothingSchema
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .then((item) => {
      if (!item) {
        return res
          .status(FORBIDDEN_REQUEST)
          .send({ message: "Item not found" });
      }
      return res.send(item);
    })
    .catch((error) => handleError(error, req, res));

const unlikeItem = (req, res) =>
  clothingSchema
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .then((item) => {
      if (!item) {
        return res
          .status(FORBIDDEN_REQUEST)
          .send({ message: "Item not found" });
      }
      return res.send(item);
    })
    .catch((error) => handleError(error, req, res));

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
