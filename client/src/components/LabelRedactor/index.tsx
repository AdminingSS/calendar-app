import React, { useState } from "react";
import axios from 'axios';
import { CompactPicker } from 'react-color';
import { createUseStyles } from 'react-jss';

import { Label } from "../../App";

import styles from './styles';

type LabelRedactorProps = {
    setRequest: (value: boolean) => void;
    setEditMode?: (value: boolean) => void;
    label?: Label;
};

const useStyles = createUseStyles(styles)

const LabelRedactor = (props: LabelRedactorProps) => {
    const { setRequest, setEditMode, label } = props
    const classes = useStyles()

    const [value, setValue] = useState({
        text: label?.text || '',
        color: label?.color || '#000000'
    })
    const [showPicker, setShowPicker] = useState(false)

    const handleTextChange = (e) => {
        setValue({
            ...value,
            text: e.target.value
        })
    }

    const handleColorChange = (color) => {
        setValue({
            ...value,
            color: color.hex
        })
        setShowPicker(false)
    };

    const openPicker = () => {
        setShowPicker(true)
    }

    const handleSubmit = () => {
        if (label?._id) {
            axios.put(`http://localhost:5000/api/labels/${label._id}`, value)
                .then(() => {
                    setRequest(true)
                })
            if (setEditMode) setEditMode(false)
        } else {
            axios.post(`http://localhost:5000/api/labels/`, value)
                .then(() => {
                    setRequest(true)
                })
        }
    }

    return (
        <div className={classes.root}>
            {showPicker ? <CompactPicker
                color={value.color}
                onChangeComplete={handleColorChange}
            /> : <div
                className={classes.colorPicker}
                onClick={openPicker}

                style={{ background: value.color}}
            />}
            <input
                value={ value.text }
                onChange={ handleTextChange }
                type="text"
            />
            <button onClick={handleSubmit}>Save</button>
        </div>
    )
}

export default LabelRedactor;