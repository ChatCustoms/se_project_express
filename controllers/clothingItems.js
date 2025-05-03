const clothingSchema = require('../models/clothingItems');

const getItems = (req, res) => {
  clothingSchema.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send({message: "Internal Server Error"});
    });
};

const createItem = (req, res) => {
  console.log('Request body:', req.body);
  console.log(req.user._id);
  const { name, weather, imageUrl } = req.body;
  if (!name || !weather || !imageUrl) {
    return res.status(400).send({ message: "All fields are required" });
    }

  clothingSchema.create({ name, weather, imageUrl, owner: req.user._id })
  .then((item) => {
    res.status(201).send(item);
  })
  .catch((error) => {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(400).send({ message: "Invalid data" });
    }
    else if (error.name === "CastError") {
      return res.status(400).send({ message: "Invalid owner ID" });
    }
    else if (error.name === "MongoError" && error.code === 11000) {
      return res.status(409).send({ message: "Item already exists" });
    }
    else if (error.name === "TypeError") {
      return res.status(400).send({ message: "Invalid data type" });
    }
    return res.status(500).send({message: "Internal Server Error"});
  });
}

const deleteItem = (req, res) => {
  const {itemId} = req.params;

  clothingSchema.deleteOne({ _id: itemId })
    .then((result) => {
      if (result.deletedCount === 0) {
        return res.status(404).send({ message: "Item not found" });
      }
      res.status(200).send({ message: "Item deleted successfully" });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send({message: "Internal Server Error"});
    });
}

module.exports = { getItems, createItem, deleteItem };