import { useEffect, useRef } from "react";

export function Task(props) {
  const dropdownRef = useRef(null);

  const priorityEmojis = {
    High: "🚨",
    Medium: "🟠",
    Low: "😎",
  };

  useEffect(() => {
    const dropdown = dropdownRef.current;
    if (!dropdown) return;

    const select = dropdown.querySelector(".select");
    const priorities = dropdown.querySelector(".priorities");

    const toggleDropdown = () => {
      priorities.classList.toggle("open");
    };

    select.addEventListener("click", toggleDropdown);

    return () => {
      select.removeEventListener("click", toggleDropdown);
    };
  }, []);

  const handleSelectPriority = async (key, e) => {
    e.stopPropagation();

    if (props.onPriorityChange) {
      props.onPriorityChange(props.task_id, key);
    }

    const dropdown = dropdownRef.current;
    if (dropdown) {
      const priorities = dropdown.querySelector(".priorities");
      priorities.classList.remove("open");
    }
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
          __html: `${props.task_description.slice(0, 10)}<b>...see more</b>`,
        }}
      ></div>

      <p className="text">
        <b>Deadline: {new Date(props.task_date).toLocaleDateString()}</b>
      </p>

      <div className="drop-down-relative-to-task">
        <div className="dropdown" ref={dropdownRef}>
          <div className="select" onClick={(e) => e.stopPropagation()}>
            <span>
              {props.priority ? priorityEmojis[props.priority] : "❓"}
            </span>
          </div>
          <ul className="priorities">
            {Object.keys(priorityEmojis).map((key) => (
              <li
                key={key}
                className={props.priority === key ? "active" : ""}
                onClick={(e) => handleSelectPriority(key, e)}
              >
                {priorityEmojis[key]}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Task;
