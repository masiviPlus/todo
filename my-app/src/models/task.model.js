module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define("Task", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deadline: DataTypes.DATE,
    story_points: DataTypes.INTEGER,
    bio: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM(
        "TODO",
        "In Progress",
        "Ready For QA",
        "In Testing",
        "Reviewed",
        "DONE",
        "Archived"
      ),
      allowNull: false,
      defaultValue: "TODO",
    },
    priority: {
      type: DataTypes.ENUM("Low", "Medium", "High"),
    },
  });

  Task.associate = (models) => {
    Task.belongsToMany(models.Tag, { through: "tasks_tabs" });
  };

  return Task;
};
