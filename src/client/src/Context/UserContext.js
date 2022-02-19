import { createContext, useState } from "react";

const UserContext = createContext({
    authStatus: false,
    id: "",
    type: "",
    updateUserStatus: ({}) => {}
});

export function UserContextProvider(props) {
    const [userAuthStatus, setUserAuthStatus] = useState(false);
    const [uid, setUid] = useState("");
    const [userType, setUserType] = useState("");

    function updateUserStatusHandler({
        authStatus: newAuthStatus,
        id: uid,
        type: userType
    }) {
        setUserAuthStatus(newAuthStatus)
        setUid(uid)
        setUserType(userType)
    }

    const context = {
        authStatus: userAuthStatus,
        id: uid,
        type: userType,
        updateUserStatus: updateUserStatusHandler
    }

    return(
        <UserContext.Provider value={context}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContext;