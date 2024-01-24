const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");

const OrdersController = require("../controllers/orders");

router.get("/", checkAuth, OrdersController.Orders_get_all);

router.post("/", checkAuth, OrdersController.Orders_create_order);

router.get("/:orderId", checkAuth, OrdersController.Orders_get_order);

router.delete("/:orderId", checkAuth, OrdersController.Orders_delete_order);

module.exports = router;
