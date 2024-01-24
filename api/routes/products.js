const path = require("path");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../upload"));
  },
  filename: function (req, file, cb) {
    const unixTimestamp = +new Date();
    cb(null, unixTimestamp + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});

const ProductController = require("../controllers/products");

router.get("/", ProductController.Products_get_all_product);

router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  ProductController.Product_create_product
);

router.get("/:productId", ProductController.Product_get_product);

router.patch(
  "/:productId",
  checkAuth,
  ProductController.Products_update_product
);

router.delete("/:productId", checkAuth);

module.exports = router;
