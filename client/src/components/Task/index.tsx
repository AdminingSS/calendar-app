import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { createUseStyles } from 'react-jss'

import { Task, Label, Modal } from "../../App";

import styles from './styles'

type TaskProps = {
    task: Task;
    labels: Label[];
    index: number;
    setModal: (value: Modal | null) => void;
};

const useStyles = createUseStyles(styles)

const TaskEl = (props: TaskProps) => {
    const { task, labels, index, setModal } = props;
    const classes = useStyles()

    const getLabelColor = (id: string) => {
        const label = labels.find((label) => label._id === id);
        return label ? label.color : "#000";
    };

    const handleClick = (event) => {
        if (event.defaultPrevented) {
            return;
        }
        setModal({ type: "editTask", data: task });
    };

    return (
        <Draggable draggableId={task._id} index={task.index}>
            {(provided) => (
                <div
                    className={classes.root}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={handleClick}
                >
                    <div className={classes.labels}>
                        {task.labels.map((label) => (
                            <div
                                key={label._id}
                                className={classes.label}
                                style={{ backgroundColor: getLabelColor(label._id) }}
                            />
                        ))}
                    </div>
                    <div className="task-title">{task.title}</div>
                </div>
            )}
        </Draggable>
    );
}

export default TaskEl;