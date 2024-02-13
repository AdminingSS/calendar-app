import React from "react";
import { toPng } from "html-to-image";

type DownloadImageProps = {
    targetId?: string;
};

const DownloadImage = (props: DownloadImageProps) => {
    const { targetId = 'root' } = props;

    const handleClick = () => {
        const target = document.getElementById(targetId);

        if (target) {
            toPng(target)
                .then((dataUrl) => {
                    const a = document.createElement("a");
                    a.href = dataUrl;
                    a.download = "calendar.png";

                    a.click();
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    return (
        <div>
            <button onClick={handleClick}>Save as image</button>
        </div>
    );
}

export default DownloadImage;