import { createContext, useState } from "react";

const UserContext = createContext({
    authStatus: false,
    id: "",
    type: ""
});

export function UserContextProvider(props) {
    const [userAuthStatus, setUserAuthStatus] = useState(false);
    const [uid, setUid] = useState("");
    const [userType, setUserType] = useState("");

    const context = {
        authStatus: userAuthStatus,
        id: uid,
        type: userType,
        updateAuthStatus: setUserAuthStatus,
        updateUid: setUid,
        updateType: setUserType
    }

    return(
        <UserContext.Provider value={context}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContext;