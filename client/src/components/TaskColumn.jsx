import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

const TaskColumn = ({ title, status, tasks, onDelete }) => {
  return (
    <div className="col">
      <h3 className="title">{title}</h3>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`tasks ${
              snapshot.isDraggingOver ? "drag-over" : "drag-idle"
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task._id} task={task} index={index} onDelete={onDelete} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskColumn;