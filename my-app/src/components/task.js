import { useState } from "react";

export function Task(props) {
  const [priority, setPriority] = useState("");

  const priorityEmojis = {
    High: "🚨",
    Medium: "🟠",
    Low: "😎",
  };

  return (
    <div
      className="dnd-item"
      draggable
      onDragStart={() => props.setActiveCard(props.task_id)}
      onDragEnd={() => props.setActiveCard(null)}
      onClick={() => props.onClick()}
    >
      <h2 className="text">{props.task_title}</h2>

      <div
        className="description text"
        dangerouslySetInnerHTML={{
          __html: `${props.task_description.slice(0, 20)}<b>...see more</b>`,
        }}
      ></div>

      <p className="text">
        <b>Deadline: {new Date(props.task_date).toLocaleDateString()}</b>
      </p>

      <div className="flex flex-col items-center p-4">
        <label className="mb-2 text-lg font-semibold">Select Priority:</label>
        <select
          className="border p-2 rounded-md"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          onClick={(e) => e.stopPropagation()}
        >
          <option value="">-- Choose Priority --</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>

        {priority && (
          <div className="mt-4 text-xl">
            Selected Priority: {priorityEmojis[priority]} ({priority})
          </div>
        )}
      </div>
    </div>
  );
}

export default Task;
