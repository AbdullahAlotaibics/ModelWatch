const express = require("express");
const {
  getAllIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
} = require("../controllers/issues.controller");
const requireRole = require("../middleware/role.middleware");

const router = express.Router();

router.get("/", requireRole("admin"), getAllIssues);
router.post("/", createIssue);
router.get("/:id", requireRole("admin", "owner", "analyst"), getIssueById);
router.put("/:id", requireRole("admin"), updateIssue);
router.delete("/:id", requireRole("admin"), deleteIssue);

module.exports = router;
