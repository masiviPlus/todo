require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const addService = require("./Services/add.service");
const updateService = require("./Services/update.service");
const getService = require("./Services/get.service");

const { sequelize, Task, Tag } = require("./models/index.model");

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    await sequelize.sync({ force: false });
    console.log("Database schema synchronized.");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

// API endpoints
app.get("/api/tasks", getService.getTask);
app.post("/api/tasks", addService.addTask);
app.put("/tasks/:id/status", updateService.updateTask);
