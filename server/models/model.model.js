const mongoose = require("mongoose");

const attributeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const noteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const historySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: ["created", "updated", "visibility_changed", "attributes_updated", "note_added"],
      required: true,
    },
    message: { type: String, required: true, trim: true },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    changes: { type: mongoose.Schema.Types.Mixed, default: {} },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const modelSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  visibility: {
    type: String,
    enum: ["private", "shared", "public"],
    default: "private",
    index: true,
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  ownerName: { type: String, required: true, trim: true },
  ownerEmail: { type: String, required: true, lowercase: true, trim: true },
  attributes: { type: [attributeSchema], default: [] },
  notes: { type: [noteSchema], default: [] },
  history: { type: [historySchema], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

modelSchema.index({ name: "text", description: "text", category: "text" });

modelSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Model", modelSchema);
