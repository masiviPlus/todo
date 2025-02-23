
-- @block
SELECT * FROM tasks;
-- @block
SELECT * FROM tags;
-- @block
SELECT * FROM tasks_tabs;
-- @block
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

-- @block
INSERT INTO tasks(title,date) VALUES(
    'To-do App', '2024-10-24', '5', '<p>wdafwqd</p>'
)
-- @block
SELECT * FROM tasks;

-- @block
SHOW COLUMNS FROM tasks LIKE 'status';
--@block
SHOW COLUMNS FROM tasks LIKE 'status';

--@block
DROP Table tasks;
--@block
DROP Table tags;
--@block
DROP Table tasks_tags;
--@block
DROP Table tasks_tabs;

--@block
DROP TABLE SequelizeMeta;

-- @block

SELECT 
    t.id AS id,
    t.title AS title,
    t.deadline AS deadline,
    t.story_points AS story_points,
    t.status AS status,
    t.bio AS bio,
    GROUP_CONCAT(tag.tag SEPARATOR ', ') AS tags
FROM 
    tasks t
LEFT JOIN 
    tasks_tabs tt ON t.id = tt.TaskId  -- Link tasks to tasks_tabs using TaskId
LEFT JOIN 
    tags tag ON tt.TagId = tag.id      -- Link tags to tasks_tabs using TagId
GROUP BY 
    t.id;


-- @block

SELECT * FROM tags

-- @block
SHOW COLUMNS FROM Tasks
-- @block
SELECT * FROM SequelizeMeta;
-- @block
DELETE FROM SequelizeMeta WHERE name = '20250223141543-add-priority-to-task.js';
