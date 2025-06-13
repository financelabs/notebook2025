import React, { useState, useContext } from "react";
import { GlobalContext } from "../../features/GlobalContext";





function GreenHeader() {
    let state = useContext(GlobalContext);

    let { avatarUrl, title } = state;

    return <div className="excelstyle mt-1">
        <div
            className="title"
            style={{
                display: "flex",
                justifyContent: "space-between",
                padding: ".4rem",
            }}
        >
            {avatarUrl && avatarUrl.length > 10 ? (
                <img
                    src={avatarUrl}
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
             {/* <LoginLogout />  */}
        </div>
    </div>
}

export default GreenHeader

