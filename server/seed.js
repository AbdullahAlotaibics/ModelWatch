const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const dns = require("dns");

const User = require("./models/user.model");
const Category = require("./models/category.model");
const Model = require("./models/model.model");
const { categories, models } = require("./data/seedData");

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected for seeding");

    // Demo users
    const demoUsers = [
      { name: "Admin User", email: "admin@modelwatch.com", password: "admin123", role: "admin" },
      { name: "John Owner", email: "owner@modelwatch.com", password: "owner123", role: "owner" },
      { name: "Sarah Analyst", email: "analyst@modelwatch.com", password: "analyst123", role: "analyst" },
    ];

    const userMap = {};

    for (const user of demoUsers) {
      let existing = await User.findOne({ email: user.email });

      if (!existing) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        existing = await User.create({
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role,
        });
      }

      userMap[user.email] = existing;
    }

    // Categories
    for (const category of categories) {
      const existingCategory = await Category.findOne({ name: category.name });
      if (!existingCategory) {
        await Category.create(category);
      }
    }

    // Models
    for (const model of models) {
      const owner = userMap[model.ownerEmail];
      if (!owner) continue;

      const existingModel = await Model.findOne({
        name: model.name,
        ownerEmail: model.ownerEmail,
      });

      if (!existingModel) {
        await Model.create({
          name: model.name,
          description: model.description,
          category: model.category,
          visibility: model.visibility,
          owner: owner._id,
          ownerName: model.ownerName,
          ownerEmail: model.ownerEmail,
          attributes: model.attributes || [],
          notes: (model.notes || []).map((text) => ({
            text,
            author: owner._id,
            createdAt: new Date(model.createdAt),
          })),
          history: (model.updates || []).map((message) => ({
            action: "updated",
            message,
            actor: owner._id,
            createdAt: new Date(model.updatedAt),
          })),
          createdAt: new Date(model.createdAt),
          updatedAt: new Date(model.updatedAt),
        });
      }
    }

    console.log("Seed completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
}

seed();