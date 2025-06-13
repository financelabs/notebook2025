import React from "react";
import { useSelector } from "react-redux";

import { selectSpreadsheetTitle } from "./spreadsheetSlice";
import { selectApplication } from "../application/applicationSlice";


import LoginLogout from "../application/LoginLogout";




function GreenHeader() {
    const title = useSelector(selectSpreadsheetTitle);
    const userProfile = useSelector(selectApplication);

    return <div
        className="title"
        style={{
            display: "flex",
            justifyContent: "space-between",
            padding: ".4rem",
        }}
    >
        {userProfile?.avatarUrl && userProfile.avatarUrl.length > 10 ? (
            <img
                src={userProfile.avatarUrl}
                alt=""
                style={{
                    verticalAlign: "middle",
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    filter: "grayscale(100%)",
                    objectFit: "cover",
                }}
            />
        ) : null}

        {!!title ? (
            <span style={{ marginLeft: "1rem" }}>{title}</span>
        ) : (
            <span>Calc</span>
        )}
        <LoginLogout />
    </div>
}

export default GreenHeader

