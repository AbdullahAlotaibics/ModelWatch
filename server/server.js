const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const dns = require("dns");
const bcrypt = require("bcryptjs");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/users.routes");
const categoryRoutes = require("./routes/categories.routes");
const issueRoutes = require("./routes/issues.routes");
const authMiddleware = require("./middleware/auth.middleware");
const User = require("./models/user.model");

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/categories", authMiddleware, categoryRoutes);
app.use("/api/issues", authMiddleware, issueRoutes);

app.get("/", (req, res) => {
  res.send("ModelWatch backend is running");
});

const demoUsers = [
  { name: "Admin User", email: "admin@modelwatch.com", password: "admin123", role: "admin" },
  { name: "John Owner", email: "owner@modelwatch.com", password: "owner123", role: "owner" },
  { name: "Sarah Analyst", email: "analyst@modelwatch.com", password: "analyst123", role: "analyst" },
];

async function seedDemoUsers() {
  for (const demoUser of demoUsers) {
    const existingUser = await User.findOne({ email: demoUser.email });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(demoUser.password, 10);
      await User.create({
        name: demoUser.name,
        email: demoUser.email,
        password: hashedPassword,
        role: demoUser.role,
      });
    }
  }
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("MongoDB connected successfully");
    await seedDemoUsers();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });
