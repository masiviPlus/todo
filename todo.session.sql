
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