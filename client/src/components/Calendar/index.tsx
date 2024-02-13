import React, { useState, useCallback, useEffect } from 'react';
import axios from "axios";
import { format, getMonth, getYear } from 'date-fns';
import { Droppable, DroppableProps } from 'react-beautiful-dnd';
import clsx from 'clsx';
import { createUseStyles } from 'react-jss';

import { API_URL } from "../../constants";

import { Task, Label, Modal } from "../../App";

import TaskEl from "../Task";
import Search from "../Search";
import Import from "../Import";
import Export from "../Export";
import DownloadImage from "../DownloadImage";

import styles from './styles';

const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
    const [enabled, setEnabled] = useState(false)

    useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true))
        return () => {
            cancelAnimationFrame(animation)
            setEnabled(false)
        }
    }, [])

    if (!enabled) {
        return null
    }

    return <Droppable {...props}>{children}</Droppable>
}

type Holiday = {
    date: string;
    name: string;
};

type CalendarProps = {
    tasks: Task[];
    labels: Label[];
    search: string;
    setModal: (value: Modal | null) => void;
    setSearch: (value: string) => void;
    setRequest: (value: boolean) => void;
};

const useStyles = createUseStyles(styles)

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function createCalendar(year: number, month: number): Date[] {
    let dates: Date[] = [];
    let date: Date = new Date(year, month - 1, 1);

    while (date.getDay() !== 1) {
        date.setDate(date.getDate() - 1);
        dates.unshift(new Date(date));
    }

    date = new Date(year, month - 1, 1);
    date.setDate(1);

    while (date.getMonth() === month - 1) {
        let newDate: Date = new Date(date);
        dates.push(newDate);
        date.setDate(date.getDate() + 1);
    }

    while (date.getDay() !== 0) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }

    dates.push(new Date(date))

    return dates;
}

const Calendar = (props: CalendarProps) => {
    const { tasks, labels, search, setModal, setSearch, setRequest } = props;
    const classes = useStyles()

    const [currentMonth, setCurrentMonth] = useState(getMonth(new Date()));
    const [currentYear, setCurrentYear] = useState(getYear(new Date()));
    const [holidays, setHolidays] = useState<Record<string, string>>({});

    const changeMonth = (direction) => {
        if (direction === 'prev') {
            if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear((prevYear) => prevYear - 1);
            } else {
                setCurrentMonth((prevMonth) => prevMonth - 1);
            }
        } else if (direction === 'next') {
            if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear((prevYear) => prevYear + 1);
            } else {
                setCurrentMonth((prevMonth) => prevMonth + 1);
            }
        }
    };

    const dates = createCalendar(currentYear, currentMonth + 1);

    const filterTasks = useCallback((date: Date) => {
        let filteredTasks = tasks.filter((task) => {
            const filterDate = format(date, "yyyy-MM-dd");
            const taskDate = format(task.date, "yyyy-MM-dd")
            return taskDate === filterDate
        });

        if (search) {
            filteredTasks = filteredTasks.filter((task) =>
                task.title.toLowerCase().includes(search.toLowerCase()) ||
                task.labels.find(label => label.text.toLowerCase().includes(search.toLowerCase()))
            );
        }

        return filteredTasks;
    }, [tasks, search]);

    const addTask = useCallback((e, date) => {
        if(e.target !== e.currentTarget || e.defaultPrevented) return

        setModal({ type: "newTask", data: { _id: "", title: "", date, labels: [] } });
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const holidaysResponse = await axios.get<Holiday[]>(
                    `${API_URL}holidays/${currentYear}/UA`
                );
                const holidaysData = holidaysResponse.data;
                const holidaysObject: Record<string, string> = {};
                holidaysData.forEach((holiday) => {
                    holidaysObject[holiday.date] = holiday.name;
                });
                setHolidays(holidaysObject);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [currentYear]);

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <h1>Task Calendar</h1>
                <div className={classes.dateChanger}>
                    <button onClick={() => changeMonth('prev')}>Prev</button>
                    <span>
                        {format(new Date(currentYear, currentMonth), 'LLLL yyyy')}
                    </span>
                    <button onClick={() => changeMonth('next')}>Next</button>
                </div>
                <div className={classes.controls}>
                    <Search setSearch={setSearch} />
                    <Import setRequest={setRequest} />
                    <Export tasks={tasks} />
                    <DownloadImage />
                </div>
            </div>
            <div className={classes.grid}>
                {weekdays.map((weekday) => (
                    <div key={weekday} className={classes.weekDay}>
                        {weekday}
                    </div>
                ))}
                {dates.map((date) => (
                    <StrictModeDroppable key={date.toISOString()} droppableId={date.toISOString()} type="task">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                style={{ backgroundColor: snapshot.isDraggingOver ? '#ddd' : '' }}
                                {...provided.droppableProps}
                                onClick={(e) => addTask(e, date)}
                                className={clsx(classes.cell, date.getMonth() !== currentMonth && classes.cellOther)}
                            >
                                <span>{date.getDate()} {holidays[format(date, "yyyy-MM-dd")]}</span>
                                {filterTasks(date).map((task, index) => (
                                    <TaskEl
                                        key={task._id}
                                        task={task}
                                        labels={labels}
                                        index={index}
                                        setModal={setModal}
                                    />
                                ))}
                                <span style={{ display: 'none' }}>{provided.placeholder}</span>
                            </div>
                        )}
                    </StrictModeDroppable>
                ))}
            </div>
        </div>
    );
}

export default Calendar;