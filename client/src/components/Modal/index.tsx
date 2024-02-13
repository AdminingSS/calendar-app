import React, { useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { createUseStyles } from 'react-jss'

import { Modal, Label, Task } from "../../App";

import LabelEl from "../Label";
import LabelRedactor from "../LabelRedactor";

import styles from './styles';

type ModalProps = {
    modal: Modal;
    setModal: (value: Modal | null) => void;
    labels: Label[];
    setRequest: (value: boolean) => void;
};

const useStyles = createUseStyles(styles)

const ModalEl = (props: ModalProps) => {
    const { modal, setModal, labels, setRequest } = props;
    const classes = useStyles()

    const [data, setData] = useState<Task | null>(modal.data);

    const formattedDate = data && format(data.date, "yyyy-MM-dd");

    const handleLabelChange = (e, label) => {
        if (e.target.checked) {
            if (data) {
                const newLabels = data.labels.concat(label)
                setData({
                    ...data,
                    labels: newLabels
                })
            }
        } else {
            if (data) {
                const newLabels = data.labels.filter(l => l._id !== label._id)
                setData({
                    ...data,
                    labels: newLabels
                })
            }
        }
    }

    const handleClose = () => {
        setModal(null);
    };

    const handleChange = (event: any) => {
        const value = event.target.value;
        setData({ ...data, title: value } as Task)
    };

    const handleSave = () => {
        if (data) {
            if (modal.type === "editTask" && data._id) {
                axios.put(`http://localhost:5000/api/tasks/${data._id}`, data)
                    .then(() => {
                        setRequest(true)
                    })
            } else if (modal.type === "newTask") {
                axios.post(`http://localhost:5000/api/tasks/`, data)
                    .then(() => {
                        setRequest(true)
                    })
            }
        }
        setModal(null);
    }

    const handleDelete = () => {
        if (data) {
            if (modal.type === "editTask"  && data._id) {
                axios.delete(`http://localhost:5000/api/tasks/${data._id}`)
                    .then(() => {
                        setRequest(true)
                    })
            }
        }
        setModal(null);
    };

    return (
        <div className={classes.root}>
            <div className={classes.content}>
                <div className={classes.header}>
                    <h2>
                        {modal.type === "newTask"
                            ? "Create a new task"
                            : modal.type === "editTask"
                                ? "View/Edit a Task"
                                : ""}
                    </h2>
                    <button onClick={handleClose}>Close</button>
                </div>
                <div>
                    <div className={classes.formRow}>
                                <label htmlFor="task-title">Task title:</label>
                                <textarea
                                    id="task-title"
                                    value={(data as Task).title}
                                    onChange={handleChange}
                                    rows={5}
                                />
                            </div>
                    <div className={classes.formRow}>
                                        <label>Tags:</label>
                                        <div className={classes.labelBox}>
                                            {labels.map(label => {
                                                const isInTask = !!(data as Task).labels.find(l => l._id === label._id)
                                                return (
                                                    <div className={classes.label} key={label._id}>
                                                        <input
                                                            type="checkbox"
                                                            checked={isInTask}
                                                            onChange={(e) => handleLabelChange(e, label)}
                                                        />
                                                    <LabelEl
                                                        label={label}
                                                        setRequest={setRequest}
                                                    />
                                                    </div>
                                                )
                                            })}
                                        </div>

                            </div>
                    <div className={classes.formRow}>
                                <label>New Tag:</label>
                                <LabelRedactor setRequest={setRequest} />
                            </div>
                    <div className={classes.formRow}>
                                <label>Date:</label>
                                <div>{formattedDate}</div>
                            </div>
                </div>
                <div className={classes.footer}>
                    <button onClick={handleSave}>
                        Save Task
                    </button>
                    <button onClick={handleDelete}>
                        Delete Task
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalEl;