require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

// Import models
const Task = require("./task.model")(sequelize, DataTypes);
const Tag = require("./tag.model")(sequelize, DataTypes);

// Define relationships
Task.belongsToMany(Tag, { through: "tasks_tags", foreignKey: "task_id" });
Tag.belongsToMany(Task, { through: "tasks_tags", foreignKey: "tag_id" });

// Authenticate and sync
// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Connection has been established successfully.");

//     await sequelize.sync({ force: false }); // Use 'force: true' only for development/testing
//     console.log("Database synced successfully.");
//   } catch (error) {
//     console.error("Unable to connect or sync to the database:", error);
//   }
// })();

module.exports = { sequelize, Task, Tag };
