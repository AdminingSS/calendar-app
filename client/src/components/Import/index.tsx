import React, { useRef } from "react";
import axios from "axios";

type ImportProps = {
    setRequest: (value: boolean) => void;
};

const Import = (props: ImportProps) => {
    const { setRequest } = props;

    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const handleChange = (event: any) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    const data = JSON.parse(reader.result as string);

                    if (Array.isArray(data) && data.every((item) => item._id)) {
                        axios.post("http://localhost:5000/api/tasks/import", data)
                            .then(() => {
                                setRequest(true)
                            })
                    } else {
                        alert("Wrong file format");
                    }
                }
            };

            reader.readAsText(file);
        }
    };

    return (
        <div>
            <button onClick={handleClick}>Import</button>
            <input
                type="file"
                ref={inputRef}
                onChange={handleChange}
                style={{ display: "none" }}
            />
        </div>
    );
}

export default Import;