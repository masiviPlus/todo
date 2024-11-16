require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();
const Sequelize = require("sequelize");
const { sequelize } = require("./index.model.js");

const PORT = process.env.PORT || 5000;
console.log("DB_USER:", process.env.DB_USER); // This should output 'nika'
console.log("DB_PASSWORD:", process.env.DB_PASSWORD); // This should output 'password'
app.use(cors());
app.use(express.json());

(async () => {
  try {
    // Authenticate database connection
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    // Sync database schema
    await sequelize.sync({ force: false }); // Change `force` to `true` for development/testing
    console.log("Database schema has been synchronized successfully.");

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((e) => {
    console.error("Unable to connect to the database: ", e);
  });

//THE OLD WAY OF CONNECTING WITHOUT SEQUELIZE

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// db.connect((err) => {
//   if (err) {
//     console.error("Error connecting to the database:", err);
//     return;
//   }
//   console.log("Connected to the MySQL database.");
// });

//////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/api/tasks", (req, res) => {
  const query = `
    SELECT 
    t.id AS task_id,
    t.title AS task_title,
    t.deadline AS task_date,
    t.story_points AS task_story_points,
    t.status AS status_now,
    t.bio AS task_description,
    GROUP_CONCAT(tag.tag SEPARATOR ', ') AS tags
FROM 
    tasks t
LEFT JOIN 
    tasks_tabs tt ON t.id = tt.task_id
LEFT JOIN 
    tags tag ON tt.tag_id = tag.id
GROUP BY 
    t.id;

    `;
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching tasks", err);
      return res.status(500).json({ error: "Database query error" });
    }
    res.status(200).json(result);
  });
});

app.post("/api/tasks", (req, response) => {
  const { title, date, storyPoints, description, tags } = req.body;
  //test HERE
  console.log("New Task:", {
    title,
    date,
    storyPoints,
    description,
    tags,
  });

  //DATABASE IMPORTANT HERE

  const insertTaskQuery = `
    INSERT INTO tasks (title, deadline, story_points, bio)
    VALUES (?, ?, ?, ?);
  `;
  db.query(
    insertTaskQuery,
    [title, date.slice(0, 10), storyPoints, description],
    (err, res) => {
      if (err) {
        console.error("Error inserting task: ", err);
        return res.status(500).json({ error: "error inserting task" });
      }
      const taskId = res.insertId;

      const tagIds = [];
      const insertTagQuery = `
    INSERT INTO tags (tag) VALUES (?)
    ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id);
    `;

      tags.forEach((tag) => {
        db.query(insertTagQuery, [tag], (tagErr, tagRes) => {
          if (tagErr) {
            console.error("Error inserting tag: ", tagErr);
            return res.status(500).json({ error: "Error inserting tag" });
          }
          const tagId = tagRes.insertId;
          tagIds.push(tagId);

          if (tagIds.length === tags.length) {
            const insertTaskTagQuery = `
                INSERT INTO tasks_tabs (task_id, tag_id) VALUES ?
                `;
            const taskTagValues = tagIds.map((tagId) => [taskId, tagId]);

            db.query(insertTaskTagQuery, [taskTagValues], (taskTagErr) => {
              if (taskTagErr) {
                console.error("Error inserting task-tag: ", taskTagErr);
                return res
                  .status(500)
                  .json({ error: "Error linking task and tag" });
              }
              //   res
              //     .status(200)
              //     .json({ message: "task and tags saved successfully!" });
            });
          }
        });
      });
    }
  );

  response.status(200).json({ message: "Task saved successfully" });
});

app.put("/tasks/:id/status", (req, res) => {
  console.log("Received data:", req.body);
  const status = req.body.status_now;
  const { id } = req.params;

  // Only updating status without index
  const sql = "UPDATE tasks SET status= ? WHERE id = ?";
  db.query(sql, [status, id], (err) => {
    if (err) {
      console.error("Error updating task status:", err);
      return res.status(500).send("Error updating task status");
    }
    res.sendStatus(200);
  });
});

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
