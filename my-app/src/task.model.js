module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define("Task", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deadline: DataTypes.DATE,
    story_points: DataTypes.INTEGER,
    bio: DataTypes.TEXT,
    status: DataTypes.ENUM(
      "TODO",
      "In Progress",
      "Ready For QA",
      "In Testing",
      "Reviewed",
      "DONE",
      "Archived"
    ),
  });
  return Task;
};
