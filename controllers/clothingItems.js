const mongoose = require("mongoose");
const clothingSchema = require("../models/clothingItems");

const { OK, CREATED } = require("../utils/statusCodes");

const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require("../utils/errors");

// GET all items
const getItems = (req, res, next) => {
  clothingSchema
    .find({})
    .then((items) => res.status(OK).send(items))
    .catch(next);
};

// POST create item
const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  if (!name || !weather || !imageUrl) {
    next(new BadRequestError("All fields are required"));
    return null;
  }

  return clothingSchema
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(CREATED).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

// DELETE item
const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid item ID"));
  }

  return clothingSchema
    .findById(itemId)
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item not found"));
      }

      if (!item.owner.equals(req.user._id)) {
        return next(
          new ForbiddenError("You do not have permission to delete this item")
        );
      }

      return item.deleteOne().then(() => res.status(OK).send(item));
    })
    .catch(next);
};

// PUT like item
const likeItem = (req, res, next) => {
  clothingSchema
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item not found"));
      }
      return res.send(item);
    })
    .catch(next);
};

// DELETE unlike item
const unlikeItem = (req, res, next) => {
  clothingSchema
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item not found"));
      }
      return res.send(item);
    })
    .catch(next);
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
