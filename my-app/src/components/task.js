export function Task(props) {
  return (
    <div
      className="dnd-item"
      draggable
      onDragStart={() => props.setActiveCard(props.task_id)}
      onDragEnd={() => props.setActiveCard(null)}
      onClick={() => props.onClick()}
    >
      <h2>{props.task_title}</h2>

      {/* <p>Story Points: {props.task_story_points}</p> */}
      {/* {props.task_description.slice(0, 20)} */}
      <div
        className="description"
        dangerouslySetInnerHTML={{
          __html: `${props.task_description.slice(0, 20)}...see more`,
        }}
      ></div>
      <p>deadline: {new Date(props.task_date).toLocaleDateString()}</p>
      {/* <p>Tags: {props.tags}</p> */}
      {/* <p>status: {props.status_now}</p> */}
    </div>
  );
}

export default Task;
