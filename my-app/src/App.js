import "./App.css";
import React, { useEffect, useState } from "react";
import { Btn } from "./components/btn.js";
import axios from "axios";
import { Task } from "./components/task.js";
import Modal from "react-modal";
import DropArea from "./components/dropArea.js";

Modal.setAppElement("#root");

function App() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  const addNewTask = (newTask) => {
    const statusTasks = tasks.filter(
      (task) => task.status_now === newTask.status_now
    );
    const newIndex = statusTasks.length;

    const indexedNewTask = { ...newTask, index: newIndex };

    setTasks((prevTasks) => [...prevTasks, indexedNewTask]);
  };

  const onDrop = async (status, index) => {
    console.log(
      `${activeCard} is going to be placed into ${status} at the position ${index}`
    );
    console.log(status);
    console.log(activeCard);
    if (activeCard == null) return;

    const taskToMove = tasks.find((task) => task.task_id === activeCard);
    if (!taskToMove) return;

    const updatedTask = { ...taskToMove, status_now: status, index };

    const updatedTasks = tasks
      .filter((task) => task.task_id !== activeCard)
      .map((task) => {
        if (task.status_now === status && task.index >= index) {
          return { ...task, index: task.index + 1 };
        }
        return task;
      });

    updatedTasks.push(updatedTask);

    setTasks(updatedTasks);
    setActiveCard(null);

    try {
      await axios.put(`http://localhost:5000/tasks/${activeCard}/status`, {
        status_now: status,
        index: index,
      });
      console.log("Task status updated successfully in the database.");
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };
  useEffect(() => {
    console.log("fetching tasks...");
    axios
      .get("http://localhost:5000/api/tasks")
      .then((response) => {
        const indexedTasks = response.data.map((task, index) => ({
          ...task,
          index,
        }));
        console.log(indexedTasks);
        setTasks(indexedTasks);
      })
      .catch((error) => {
        console.log("ERROR fetching tasks:", error);
      });
  }, []);

  const customStyles = {
    content: {
      backgroundColor: "#1a1a1a",
      color: "#e0e0e0",
      borderRadius: "10px",
      padding: "50px",
      height: "400px",
      border: "1px solid #333",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
      minWidth: "300px",
      maxWidth: "500px",
      margin: "auto",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      zIndex: 1000,
    },
  };

  const color = () => {
    if (Number(selectedTask.task_story_points) < 3) {
      return { color: "#66BB6A", backgroundColor: "#2E7D32" };
    } else if (Number(selectedTask.task_story_points) === 3) {
      return { color: "#FFB74D", backgroundColor: "#EF6C00" };
    } else {
      return { color: "#E57373", backgroundColor: "#B71C1C" };
    }
  };

  const openModal = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const data = [
    {
      title: "TODO",
      items: tasks
        .filter((i) => i.status_now === "TODO")
        .sort((a, b) => a.index - b.index),
    },
    {
      title: "In Progress",
      items: tasks
        .filter((i) => i.status_now === "In Progress")
        .sort((a, b) => a.index - b.index),
    },
    {
      title: "Ready For QA",
      items: tasks
        .filter((i) => i.status_now === "Ready For QA")
        .sort((a, b) => a.index - b.index),
    },
    {
      title: "In Testing",
      items: tasks
        .filter((i) => i.status_now === "In Testing")
        .sort((a, b) => a.index - b.index),
    },
    {
      title: "Reviewed",
      items: tasks
        .filter((i) => i.status_now === "Reviewed")
        .sort((a, b) => a.index - b.index),
    },
    {
      title: "DONE",
      items: tasks
        .filter((i) => i.status_now === "DONE")
        .sort((a, b) => a.index - b.index),
    },
    {
      title: "Archived",
      items: tasks
        .filter((i) => i.status_now === "Archived")
        .sort((a, b) => a.index - b.index),
    },
  ];

  return (
    <div className="App">
      <header>
        <h1>To-Do App</h1>
        <Btn addNewTask={addNewTask} />
      </header>
      <main>
        <div className="drag-n-drop">
          {data.map((grp, grpI) => (
            <div className="dnd-group" key={grp.title}>
              <h1>{grp.title}</h1>
              <DropArea
                status={grp.title}
                index={0}
                onDrop={(status, index) => onDrop(status, 0)}
              />
              {grp.items.map((task, taskI) => (
                <React.Fragment key={task.task_id}>
                  <Task
                    draggable
                    onClick={() => openModal(task)}
                    className="task"
                    task_id={task.task_id}
                    task_title={task.task_title}
                    task_date={task.task_date}
                    task_story_points={task.task_story_points}
                    task_description={task.task_description}
                    tags={task.tags}
                    status_now={task.status_now}
                    setActiveCard={setActiveCard}
                  />
                  <DropArea
                    status={grp.title}
                    index={task.index + 1}
                    onDrop={(status, index) => onDrop(status, index)}
                  />
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
        <Modal
          isOpen={isModalOpen}
          style={customStyles}
          onRequestClose={closeModal}
        >
          {selectedTask && (
            <div className="in-modal-style">
              <h2 className="title">{selectedTask.task_title}</h2>
              <div
                className="description"
                dangerouslySetInnerHTML={{
                  __html: selectedTask.task_description,
                }}
              />
              <h3 style={color()} className="story-point">
                {selectedTask.task_story_points}
              </h3>
              <div>
                {selectedTask.tags?.split(",").map((tag, index) => (
                  <h3 className="tag" key={index}>
                    {tag}{" "}
                  </h3>
                ))}
              </div>
              <p>
                Deadline:{" "}
                {selectedTask.task_date.slice(0, 10).replaceAll("-", "/")}
              </p>
              <button onClick={closeModal} className="close-btn">
                Close
              </button>
            </div>
          )}
        </Modal>
        <h1>active card - {activeCard}</h1>
      </main>
    </div>
  );
}

export default App;
