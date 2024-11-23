require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// const { sequelize } = require("./index.model.js");
// const { Task } = require("./task.model.js");
// const { Tag } = require("./tag.model.js");
const { sequelize, Task, Tag } = require("./index.model.js");

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
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.findAll({
      include: {
        model: Tag,
        attributes: ["tag"],
        through: { attributes: [] },
      },
    });

    const result = tasks.map((task) => ({
      task_id: task.id,
      task_title: task.title,
      task_date: task.deadline,
      task_story_points: task.story_points,
      status_now: task.status,
      task_description: task.bio,
      tags: task.Tags.map((tag) => tag.tag).join(", "),
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

app.post("/api/tasks", async (req, res) => {
  const { title, date, storyPoints, description, tags } = req.body;
  console.log(title, date, storyPoints, description, tags);
  try {
    const newTask = await Task.create({
      title,
      deadline: date,
      story_points: storyPoints,
      bio: description,
    });

    const tagInstances = await Promise.all(
      tags.map((tag) =>
        Tag.findOrCreate({
          where: { tag },
        })
      )
    );

    await newTask.addTags(tagInstances.map(([tagInstance]) => tagInstance));
    res.status(200).json({ message: "Task saved successfully!" });
  } catch (error) {
    console.error("Error saving task:", error);
    res.status(500).json({ error: "Error saving task" });
  }
});

app.put("/tasks/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status_now } = req.body;

  try {
    await Task.update(
      { status: status_now },
      {
        where: { id },
      }
    );
    res.sendStatus(200);
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ error: "Error updating task status" });
  }
});
