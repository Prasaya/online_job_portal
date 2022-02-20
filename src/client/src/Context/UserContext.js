import { createContext, useState, useEffect } from 'react';

const UserContext = createContext({
  authStatus: false,
  id: '',
  type: '',
  updateUserStatus: ({
    authStatus: newAuthStatus,
    id: uid,
    type: userType,
  }) => {},
});

export function UserContextProvider(props) {
  const [userAuthStatus, setUserAuthStatus] = useState(false);
  const [uid, setUid] = useState('');
  const [userType, setUserType] = useState('');

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/user');
      const data = await res.json();
      setUserAuthStatus(data.success);
      setUid(data.success ? data.user.basics.id : '');
      setUserType(data.success ? data.user.basics.type : '');
    })();
  }, []);

  function updateUserStatusHandler({
    authStatus: newAuthStatus,
    id: uid,
    type: userType,
  }) {
    setUserAuthStatus(newAuthStatus);
    setUid(uid);
    setUserType(userType);
  }

  const context = {
    authStatus: userAuthStatus,
    id: uid,
    type: userType,
    updateUserStatus: updateUserStatusHandler,
  };

  return (
    <UserContext.Provider value={context}>
      {props.children}
    </UserContext.Provider>
  );
}

export default UserContext;
