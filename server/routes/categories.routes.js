const express = require("express");
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories.controller");
const requireRole = require("../middleware/role.middleware");

const router = express.Router();

router.get("/", getAllCategories);
router.post("/", requireRole("admin"), createCategory);
router.put("/:id", requireRole("admin"), updateCategory);
router.delete("/:id", requireRole("admin"), deleteCategory);

module.exports = router;
