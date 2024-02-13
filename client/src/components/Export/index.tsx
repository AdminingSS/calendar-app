import React from "react";

import { Task } from "../../App";

type ExportProps = {
    tasks: Task[];
};

const Export = (props: ExportProps) => {
    const { tasks } = props;

    const handleClick = () => {
        const blob = new Blob([JSON.stringify(tasks)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = "tasks.json";

        a.click();

        URL.revokeObjectURL(url);
    };

    return (
        <div>
            <button onClick={handleClick}>Export</button>
        </div>
    );
}

export default Export;