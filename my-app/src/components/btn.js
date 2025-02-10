import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";

export function Btn({ addNewTask }) {
  const [showFields, setShowFields] = useState(false);
  const [date, setDate] = useState(new Date());
  const [title, setTitle] = useState("");
  const [storyPoints, setStoryPoints] = useState("");
  const [value, setValue] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const fieldsRef = useRef(null);

  const handleClick = () => {
    setShowFields(!showFields);
  };

  const saveButtonClick = async () => {
    const taskData = {
      title,
      date,
      storyPoints,
      description: value,
      status_now: "TODO",
      tags: selectedTags.map((tag) => tag.value),
    };

    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });
      console.log(response);
      if (response.ok) {
        const newTask = await response.json();
        console.log("task saved successfully!");
        addNewTask(newTask);
        setShowFields(false);
        setTitle("");
        setDate(new Date());
        setStoryPoints("");
        setValue("");
        setSelectedTags([]);
      } else {
        console.error("Error saving task");
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };
  const handleDateChange = (newDate) => {
    setDate(newDate);
  };
  const tagOptions = [
    { value: "Bug", label: "Bug" },
    { value: "Frontend", label: "Frontend" },
    { value: "Backend", label: "Backend" },
    { value: "Urgent", label: "Urgent" },
    { value: "Chores", label: "Chores" },
  ];
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fieldsRef.current && !fieldsRef.current.contains(event.target)) {
        setShowFields(false);
      }
    };

    if (showFields) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFields]);

  return (
    <div id="btn-and-fillin">
      <button id="add-btn" onClick={handleClick}>
        <b>ADD TASK</b>
      </button>
      {showFields && (
        <div id="new-task-inputs" ref={fieldsRef}>
          <input
            id="title-input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></input>
          <DatePicker onChange={handleDateChange} value={date} />
          <span>
            How hard from 1 to 5?{" "}
            <input
              id="story-point"
              value={storyPoints}
              onChange={(e) => setStoryPoints(e.target.value)}
            ></input>
          </span>
          <ReactQuill theme="snow" value={value} onChange={setValue} />
          {/* <div className="preview"> */}
          {/* <h2>Preview:</h2> */}
          {/* <div dangerouslySetInnerHTML={{ __html: value }} /> */}
          {/* </div> */}

          <Select
            isMulti
            options={tagOptions}
            value={selectedTags}
            onChange={setSelectedTags}
            placeholder="Select tags..."
          ></Select>
          <button id="save-btn" onClick={saveButtonClick}>
            Save
          </button>
        </div>
      )}
    </div>
  );
}

export default Btn;
