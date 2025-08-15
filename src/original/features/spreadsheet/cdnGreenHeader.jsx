let { useSelector } = ReactRedux;

import {
  selectApplication
} from '../application/cdnApplicationSlice';

import { selectSpreadsheetTitle } from "./cdnSpreadsheetSlice";
import LoginLogout from "../application/cdnLoginLogout";

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
    {/*    <div>LoginLogout</div> */}
         <LoginLogout /> 
    </div>
}

export default GreenHeader

