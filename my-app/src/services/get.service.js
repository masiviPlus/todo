const { Task, Tag } = require("../models/index.model");

class GetService {
  static async getTask(req, res) {
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
        priority: task.priority,
        tags: task.Tags.map((tag) => tag.tag).join(", "),
      }));

      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
}

module.exports = GetService;
