const mongoose = require("mongoose");
const Model = require("../models/model.model");
const User = require("../models/user.model");

const writableFields = ["name", "description", "category", "visibility", "attributes"];

function isAdmin(user) {
  return user?.role === "admin";
}

function isOwner(user, model) {
  const ownerId = model.owner?._id || model.owner;
  return ownerId?.toString() === user?._id?.toString();
}

function canReadModel(user, model) {
  return isAdmin(user) || isOwner(user, model) || ["public", "shared"].includes(model.visibility);
}

function canWriteModel(user, model) {
  return isAdmin(user) || isOwner(user, model);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildAccessibleQuery(user) {
  if (isAdmin(user)) {
    return {};
  }

  return {
    $or: [
      { owner: user._id },
      { visibility: { $in: ["public", "shared"] } },
    ],
  };
}

function normalizeAttributes(attributes) {
  if (!Array.isArray(attributes)) {
    return [];
  }

  return attributes
    .filter((attribute) => attribute?.name && attribute?.value)
    .map((attribute) => ({
      name: String(attribute.name).trim(),
      value: String(attribute.value).trim(),
    }));
}

function getChangedFields(model, body) {
  const changes = {};

  for (const field of writableFields) {
    if (body[field] === undefined) {
      continue;
    }

    const nextValue = field === "attributes" ? normalizeAttributes(body[field]) : body[field];
    const currentValue = field === "attributes" ? model.attributes : model[field];

    if (JSON.stringify(currentValue) !== JSON.stringify(nextValue)) {
      changes[field] = {
        from: currentValue,
        to: nextValue,
      };
    }
  }

  return changes;
}

function getUpdateAction(changes) {
  const changedFields = Object.keys(changes);

  if (changedFields.length === 1 && changedFields[0] === "visibility") {
    return "visibility_changed";
  }

  if (changedFields.length === 1 && changedFields[0] === "attributes") {
    return "attributes_updated";
  }

  return "updated";
}

function summarizeUpdate(changes) {
  const changedFields = Object.keys(changes);

  if (changedFields.length === 0) {
    return "No model changes submitted";
  }

  if (changedFields.length === 1 && changedFields[0] === "visibility") {
    return `Visibility changed to ${changes.visibility.to}`;
  }

  if (changedFields.length === 1 && changedFields[0] === "attributes") {
    return "Model attributes updated";
  }

  return `Model updated: ${changedFields.join(", ")}`;
}

async function resolveOwner(req) {
  const ownerId = req.body.ownerId || req.body.owner;

  if (!ownerId || !isAdmin(req.user)) {
    return req.user;
  }

  if (!mongoose.Types.ObjectId.isValid(ownerId)) {
    return null;
  }

  return User.findById(ownerId).select("-password");
}

exports.getAllModels = async (req, res) => {
  try {
    const { search, q, category, visibility, owner, ownerEmail, sort = "-updatedAt" } = req.query;
    const query = buildAccessibleQuery(req.user);
    const searchValue = search || q;

    if (searchValue) {
      const pattern = new RegExp(escapeRegex(searchValue), "i");
      query.$and = [
        {
          $or: [
            { name: pattern },
            { description: pattern },
            { category: pattern },
            { "attributes.name": pattern },
            { "attributes.value": pattern },
          ],
        },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (visibility) {
      query.visibility = visibility;
    }

    if (owner) {
      if (!mongoose.Types.ObjectId.isValid(owner)) {
        return res.status(400).json({ message: "Invalid owner id" });
      }

      query.owner = owner;
    }

    if (ownerEmail) {
      query.ownerEmail = ownerEmail.toLowerCase();
    }

    const models = await Model.find(query)
      .sort(sort)
      .populate("owner", "name email role")
      .populate("notes.author", "name email role")
      .populate("history.actor", "name email role");

    return res.json(models);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch models", error: error.message });
  }
};

exports.getModelById = async (req, res) => {
  try {
    const model = await Model.findById(req.params.id)
      .populate("owner", "name email role")
      .populate("notes.author", "name email role")
      .populate("history.actor", "name email role");

    if (!model) {
      return res.status(404).json({ message: "Model not found" });
    }

    if (!canReadModel(req.user, model)) {
      return res.status(403).json({ message: "Forbidden: model is not visible to this user" });
    }

    return res.json(model);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch model", error: error.message });
  }
};

exports.createModel = async (req, res) => {
  try {
    const { name, description, category, visibility = "private" } = req.body;

    if (!name || !description || !category) {
      return res.status(400).json({ message: "Name, description, and category are required" });
    }

    const owner = await resolveOwner(req);
    if (!owner) {
      return res.status(400).json({ message: "Valid owner is required" });
    }

    const model = await Model.create({
      name,
      description,
      category,
      visibility,
      owner: owner._id,
      ownerName: owner.name,
      ownerEmail: owner.email,
      attributes: normalizeAttributes(req.body.attributes),
      history: [
        {
          action: "created",
          message: "Model created",
          actor: req.user._id,
          changes: {
            name,
            description,
            category,
            visibility,
          },
        },
      ],
    });

    return res.status(201).json(model);
  } catch (error) {
    return res.status(500).json({ message: "Unable to create model", error: error.message });
  }
};

exports.updateModel = async (req, res) => {
  try {
    const model = await Model.findById(req.params.id);

    if (!model) {
      return res.status(404).json({ message: "Model not found" });
    }

    if (!canWriteModel(req.user, model)) {
      return res.status(403).json({ message: "Forbidden: only the model owner or admin can update this model" });
    }

    const changes = getChangedFields(model, req.body);

    for (const field of writableFields) {
      if (req.body[field] === undefined) {
        continue;
      }

      model[field] = field === "attributes" ? normalizeAttributes(req.body[field]) : req.body[field];
    }

    if (Object.keys(changes).length > 0) {
      model.history.push({
        action: getUpdateAction(changes),
        message: summarizeUpdate(changes),
        actor: req.user._id,
        changes,
      });
    }

    await model.save();

    const updatedModel = await Model.findById(model._id)
      .populate("owner", "name email role")
      .populate("notes.author", "name email role")
      .populate("history.actor", "name email role");

    return res.json({ message: "Model updated successfully", model: updatedModel });
  } catch (error) {
    return res.status(500).json({ message: "Unable to update model", error: error.message });
  }
};

exports.deleteModel = async (req, res) => {
  try {
    const model = await Model.findById(req.params.id);

    if (!model) {
      return res.status(404).json({ message: "Model not found" });
    }

    if (!canWriteModel(req.user, model)) {
      return res.status(403).json({ message: "Forbidden: only the model owner or admin can delete this model" });
    }

    await model.deleteOne();
    return res.json({ message: "Model deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete model", error: error.message });
  }
};

exports.addModelNote = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Note text is required" });
    }

    const model = await Model.findById(req.params.id);

    if (!model) {
      return res.status(404).json({ message: "Model not found" });
    }

    if (!canReadModel(req.user, model)) {
      return res.status(403).json({ message: "Forbidden: model is not visible to this user" });
    }

    model.notes.push({
      text,
      author: req.user._id,
    });

    model.history.push({
      action: "note_added",
      message: "Analytical note added",
      actor: req.user._id,
      changes: { text },
    });

    await model.save();

    const updatedModel = await Model.findById(model._id)
      .populate("owner", "name email role")
      .populate("notes.author", "name email role")
      .populate("history.actor", "name email role");

    return res.status(201).json({ message: "Note added successfully", model: updatedModel });
  } catch (error) {
    return res.status(500).json({ message: "Unable to add model note", error: error.message });
  }
};

exports.getModelHistory = async (req, res) => {
  try {
    const model = await Model.findById(req.params.id).populate("history.actor", "name email role");

    if (!model) {
      return res.status(404).json({ message: "Model not found" });
    }

    if (!canReadModel(req.user, model)) {
      return res.status(403).json({ message: "Forbidden: model is not visible to this user" });
    }

    return res.json(model.history);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch model history", error: error.message });
  }
};
