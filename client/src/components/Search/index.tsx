import React, { useState } from "react";

type SearchProps = {
    setSearch: (value: string) => void;
};

const Search = (props: SearchProps) => {
    const { setSearch } = props;

    const [value, setValue] = useState("");

    const handleChange = (event: any) => {
        const value = event.target.value;

        setValue(value);
        setSearch(value);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search by task or tag"
                value={value}
                onChange={handleChange}
            />
        </div>
    );
}

export default Search;