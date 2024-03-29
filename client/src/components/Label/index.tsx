import React, { useState } from "react";
import { createUseStyles } from 'react-jss'

import { API_URL } from "../../constants";

import { Label } from "../../App";

import LabelRedactor from "../LabelRedactor";

import styles from './styles';
import axios from "axios";

type LabelProps = {
    label: Label;
    setRequest: (value: boolean) => void;
};

const useStyles = createUseStyles(styles)

const LabelEl = (props: LabelProps) => {
    const { label, setRequest } = props;
    const classes = useStyles()

    const [editMode, setEditMode] = useState(false)

    const handleEdit = () => {
        setEditMode(true)
    };

    const handleDelete = () => {
        if(label._id) {
            axios.delete(`${API_URL}labels/${label._id}`)
                .then(() => {
                    setRequest(true)
                })
        }
    }

    return (
        <div className={classes.root}>
            {editMode ? (
                <LabelRedactor
                    setRequest={setRequest}
                    setEditMode={setEditMode}
                    label={label}
                />
            ) : (
                <>
                    <div className={classes.text} style={{ backgroundColor: label.color }}>
                        {label.text}
                    </div>
                    <button onClick={handleEdit}>Edit</button>
                    <button onClick={handleDelete}>Del</button>
                </>
            )}
        </div>
    );
}

export default LabelEl;