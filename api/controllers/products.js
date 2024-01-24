const Product = require("../models/product");
const mongoose = require("mongoose");

exports.Products_get_all_product = (req, res, next) => {
  Product.find()
    .select("name price productImage _id")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        product: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id,
            },
          };
        }),
      };
      console.log(docs);
      res.status(200).json(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error });
    });
};

exports.Product_create_product = (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Created product successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          productImage: result.productImage,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + result._id,
          },
        },
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error });
    });
};

exports.Product_get_product = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price productImage _id")
    .exec()
    .then((doc) => {
      console.log("from the database", doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/",
          },
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error });
    });
};

exports.Products_update_product = (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product Updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + id,
        },
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error });
    });
};

exports.Products_delete_product = (req, res, next) => {
  const id = req.params.productId;
  Product.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product Deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/products/",
          body: { name: "string", price: "Number" },
        },
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error });
    });
};
