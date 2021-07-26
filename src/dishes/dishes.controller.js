const { notDeepStrictEqual } = require("assert");
const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

function create(req, res) {
  const {
    data: { id, name, description, price, image_url },
  } = req.body;

  const newId = nextId();
  const newName = req.body.data.name;
  const newDescription = req.body.data.description;
  const newPrice = req.body.data.price;
  const newImageUrl = req.body.data.image_url;

  const newDish = {
    id: newId,
    name: newName,
    description: newDescription,
    price: newPrice,
    image_url: newImageUrl,
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

function dishExists(req, res, next) {
  const dishId = req.params.dishId;
  foundDish = dishes.filter((dish) => dish.id === dishId);
  if (foundDish.length > 0) {
    res.locals.dish = foundDish;
    next();
  } else {
    next({ status: 404, message: `Dish ${dishId} not found.` });
  }
}

function read(req, res, next) {
  const foundDish = res.locals.dish;
  if (foundDish) {
    res.json({ data: foundDish[0] });
  }
}

function isNameValid(req, res, next) {
  const { data: name } = req.body;
  if (
    req.body.data.name === null ||
    req.body.data.name === "" ||
    req.body.data.name === undefined
  ) {
    next({ status: 400, message: "Dish must include a name." });
  }
  next();
}

function isDescriptionValid(req, res, next) {
  const { data: description } = req.body;
  if (
    req.body.data.description === null ||
    req.body.data.description === undefined ||
    req.body.data.description === ""
  ) {
    next({ status: 400, message: "Dish must include a description." });
  }
  next();
}

function isPriceValid(req, res, next) {
  const { data: price } = req.body;
  if (
    req.body.data.price === null ||
    req.body.data.price === undefined ||
    req.body.data.price === ""
  ) {
    next({ status: 400, message: "Dish must include a price." });
  }
  if (typeof req.body.data.price === "number" && req.body.data.price > 0) {
    return next();
  } else {
    next({
      status: 400,
      message: `The price must be a number greater than 0.`,
    });
  }
}

function isUrlValid(req, res, next) {
  const { data: image_url } = req.body;
  if (
    req.body.data.image_url === null ||
    req.body.data.image_url === undefined ||
    req.body.data.image_url === ""
  ) {
    next({ status: 400, message: "Dish must include an image_url." });
  }
  next();
}

function isIdValid(req, res, next) {
  let {
    data: { id },
  } = req.body;
  const dishId = req.params.dishId;
  if (
    req.body.data.id === null ||
    req.body.data.id === undefined ||
    req.body.data.id === ""
  ) {
    return next();
  }
  if (req.body.data.id !== dishId) {
    next({
      status: 400,
      message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
    });
  } else {
    next();
  }
}

function update(req, res) {
  dishId = req.params.dishId;
  let {
    data: { name, description, price, image_url },
  } = req.body;
  let updatedDish = {
    id: dishId,
    name: req.body.data.name,
    description: req.body.data.description,
    price: req.body.data.price,
    image_url: req.body.data.image_url,
  };
  return res.json({ data: updatedDish });
}

function list(req, res) {
  res.json({ data: dishes });
}

module.exports = {
  list,
  create: [isNameValid, isDescriptionValid, isPriceValid, isUrlValid, create],
  read: [dishExists, read],
  update: [
    dishExists,
    isNameValid,
    isDescriptionValid,
    isPriceValid,
    isUrlValid,
    isIdValid,
    update,
  ],
};
