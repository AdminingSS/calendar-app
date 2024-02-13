import React, {useState, useEffect, useCallback} from "react";
import { createPortal } from 'react-dom';
import axios from "axios";
import { DragDropContext } from "react-beautiful-dnd";

import ModalEl from "./components/Modal";
import Calendar from "./components/Calendar";

export type Task = {
  _id: string;
  title: string;
  date: Date | string;
  labels: Label[];
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

  const handleDragEnd = useCallback ((result: any) => {
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
      const newTasks = [...tasks];
      const taskIndex = newTasks.findIndex((task) => task._id === draggableId);
      const [task] = newTasks.splice(taskIndex, 1);

      task.date = destination.droppableId;
      newTasks.splice(destination.index, 0, task);

      setTasks(newTasks);

      axios.put(`http://localhost:5000/api/tasks/${task._id}`, task);
    }
  }, [tasks])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksResponse = await axios.get<Task[]>(
            "http://localhost:5000/api/tasks"
        );
        const tasksData = tasksResponse.data;
        setTasks(tasksData);

        const labelsResponse = await axios.get<Label[]>(
            "http://localhost:5000/api/labels"
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