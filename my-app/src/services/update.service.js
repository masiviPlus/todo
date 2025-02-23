const { Task, Tag } = require("../models/index.model");

class UpdateService {
  static async updateTask(req, res) {
    const { id } = req.params;
    const { status_now, priority } = req.body;

    try {
      const updateFields = {};
      if (status_now) updateFields.status = status_now;
      if (priority) updateFields.priority = priority;

      await Task.update(updateFields, { where: { id } });

      res.sendStatus(200);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ error: "Error updating task" });
    }
  }
}

module.exports = UpdateService;
