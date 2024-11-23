
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config(); 

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

const Task = require("./task.model.js")(sequelize, DataTypes);
const Tag = require("./tag.model.js")(sequelize, DataTypes);

const models = { Task, Tag };

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models); 
  }
});

module.exports = { sequelize, ...models };
