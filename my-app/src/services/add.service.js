const { Task, Tag } = require("../models/index.model");

class AddService {
  static async addTask(req, res) {
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
  }
}

module.exports = AddService;
