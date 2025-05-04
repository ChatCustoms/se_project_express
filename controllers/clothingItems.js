const clothingSchema = require("../models/clothingItems");
const { handleError, NotFoundError } = require("../utils/errors");

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
  }
  else {
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

  clothingSchema
    .findById(itemId)
    .orFail(() => new NotFoundError("Item not found"))
    .then(() => clothingSchema.deleteOne({ _id: itemId }))
    .then(() => {
      res.status(200).send({ message: "Item deleted successfully" });
    })
    .catch((error) => {
      handleError(error, req, res);
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
