const { Task, Tag } = require("../models/index.model");

class UpdateService {
  static async updateTask(req, res) {
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
  }
}

module.exports = UpdateService;
