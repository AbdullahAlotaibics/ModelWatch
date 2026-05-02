const express = require("express");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users.controller");
const requireRole = require("../middleware/role.middleware");

const router = express.Router();

router.get("/", requireRole("admin"), getAllUsers);
router.post("/", requireRole("admin"), createUser);
router.get("/:id", requireRole("admin"), getUserById);
router.put("/:id", requireRole("admin"), updateUser);
router.delete("/:id", requireRole("admin"), deleteUser);

module.exports = router;
