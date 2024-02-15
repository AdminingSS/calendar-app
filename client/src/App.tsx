import React, {useState, useEffect, useCallback} from "react";
import { createPortal } from 'react-dom';
import axios from "axios";
import { DragDropContext } from "react-beautiful-dnd";

import { API_URL } from "./constants";

import ModalEl from "./components/Modal";
import Calendar from "./components/Calendar";

export type Task = {
  _id: string;
  title: string;
  date: Date | string;
  labels: Label[];
  index: number;
};

export type Label = {
  _id: string;
  text: string;
  color: string;
};

export type Modal = {
  type: "newTask" | "editTask" | null;
  data: Task | null;
};

const App = () => {
  const [request, setRequest] = useState<boolean>(true)
  const [tasks, setTasks] = useState<Task[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [search, setSearch] = useState<string>("");
  const [modal, setModal] = useState<Modal | null>(null);

  const handleDragEnd = useCallback (async (result: any) => {
    const { source, destination, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
    ) {
      return;
    }

    if (type === "task") {
      const destinationTasks = tasks.filter(tsk => tsk.date === destination.droppableId && tsk._id !== draggableId)

      const task = tasks.find((task) => task._id === draggableId);

      if(!task) return;

      task.date = destination.droppableId;
      task.index = destination.index;

      destinationTasks.splice(destination.index, 0, task);

      destinationTasks.forEach((tsk, index) => {
        tsk.index = index;
      })

      const sourceTasks = tasks.filter(tsk => tsk.date === source.droppableId && tsk.date !== destination.droppableId)

      sourceTasks.forEach((tsk, index) => {
        tsk.index = index;
      })

      axios.post(`${API_URL}tasks/bulk`, destinationTasks.concat(sourceTasks))
          .then(() => {
            setRequest(true)
          })
    }
  }, [tasks])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksResponse = await axios.get<Task[]>(
            `${API_URL}tasks`
        );
        const tasksData = tasksResponse.data;
        setTasks(tasksData);

        const labelsResponse = await axios.get<Label[]>(
            `${API_URL}labels`
        );
        const labelsData = labelsResponse.data;
        setLabels(labelsData);
      } catch (error) {
        console.error(error);
      }
    };

    if (request) {
      setRequest(false)

      fetchData();
    }
  }, [request]);

  return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <div style={{background: '#fff'}}>
          <Calendar
              tasks={tasks}
              labels={labels}
              search={search}
              setModal={setModal}
              setSearch={setSearch}
              setRequest={setRequest}
          />
          {modal && createPortal(
              <ModalEl
                  modal={modal}
                  setModal={setModal}
                  labels={labels}
                  setRequest={setRequest}
              />,
              document.body
          )}
        </div>
      </DragDropContext>
  );
}

export default App;