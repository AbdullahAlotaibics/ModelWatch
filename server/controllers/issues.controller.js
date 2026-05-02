const Issue = require("../models/issue.model");

exports.getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find().populate("reporter", "name email role");
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch issues", error: error.message });
  }
};

exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate("reporter", "name email role");
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch issue", error: error.message });
  }
};

exports.createIssue = async (req, res) => {
  try {
    const { title, description, modelId, modelName, reason, severity } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Issue title is required" });
    }

    const issue = await Issue.create({
      title,
      description,
      modelId,
      modelName,
      reason,
      severity,
      reporter: req.user._id,
    });

    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ message: "Unable to create issue", error: error.message });
  }
};

exports.updateIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.title = req.body.title || issue.title;
    issue.description = req.body.description || issue.description;
    issue.status = req.body.status || issue.status;
    issue.modelId = req.body.modelId || issue.modelId;
    issue.modelName = req.body.modelName || issue.modelName;
    issue.reason = req.body.reason || issue.reason;
    issue.severity = req.body.severity || issue.severity;
    issue.resolutionNote = req.body.resolutionNote || issue.resolutionNote;

    await issue.save();
    res.json({ message: "Issue updated successfully", issue });
  } catch (error) {
    res.status(500).json({ message: "Unable to update issue", error: error.message });
  }
};

exports.deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    res.json({ message: "Issue deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete issue", error: error.message });
  }
};
