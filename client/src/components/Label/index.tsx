import React, { useState } from "react";
import { createUseStyles } from 'react-jss'

import { Label } from "../../App";

import LabelRedactor from "../LabelRedactor";

import styles from './styles';

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
                </>
            )}
        </div>
    );
}

export default LabelEl;