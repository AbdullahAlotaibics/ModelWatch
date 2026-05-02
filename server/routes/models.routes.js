const express = require("express");
const {
  getAllModels,
  getModelById,
  createModel,
  updateModel,
  deleteModel,
  addModelNote,
  getModelHistory,
} = require("../controllers/models.controller");
const requireRole = require("../middleware/role.middleware");

const router = express.Router();

router.get("/", getAllModels);
router.post("/", requireRole("admin", "owner"), createModel);
router.get("/:id", getModelById);
router.put("/:id", requireRole("admin", "owner"), updateModel);
router.delete("/:id", requireRole("admin", "owner"), deleteModel);
router.post("/:id/notes", requireRole("admin", "owner", "analyst"), addModelNote);
router.get("/:id/history", getModelHistory);

module.exports = router;
