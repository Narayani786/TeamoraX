import React from 'react';
import { Draggable } from '@hello-pangea/dnd';

const TaskCard = ({ task, index, onDelete }) => {
    return (
        <Draggable draggableId={task._id.toString()} index={index} key={task._id}>
            {(provided) => (
                <div
                className="task-card"
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                >
                <h4>{task.title}</h4>
                <p>{task.description}</p>
                <p>Status: {task.status}</p>
                <button onClick={() => onDelete(task._id)} className='delete-task' title='Delete Task'>
                    ✕
                </button>
                </div>
            )}
        </Draggable>
    );
};

export default TaskCard;
