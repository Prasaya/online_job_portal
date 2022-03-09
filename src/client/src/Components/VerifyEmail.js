import { useEffect, useContext, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import UserContext from '../Context/UserContext';

function VerifyEmail() {
  const userCtx = useContext(UserContext);
  const [status, setStatus] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!userCtx.verifyStatus) {
      (async () => {
        const res = await fetch(`/api/verify/verify-email/${token}`);
        const data = await res.json();
        console.log(data);
        if (data.success) {
          userCtx.updateUserStatus({
            authStatus: userCtx.authStatus,
            verifyStatus: true,
            id: userCtx.id,
            type: userCtx.type,
          });
          setStatus(true);
        }
      })();
    }
  }, []);
  console.log(status);
  if (userCtx.verifyStatus && !status) {
    return (
      <div className="container text-center">
        <div className="py-3 px-5 m-5 bg-light">
          <p>
            User already verified. Continue to <Link to="/">Home Page.</Link>
          </p>
        </div>
      </div>
    );
  }
  if (!status) {
    return (
      <div className="container text-center">
        <div className="py-3 px-5 m-5 bg-light">
          <p>User could not be successfully verified.</p>
        </div>
      </div>
    );
  } else {
    <div className="container text-center">
      <div className="py-3 px-5 m-5 bg-light">
        <p>
          User successfully verified. Continue to <Link to="/">Home Page.</Link>
        </p>
      </div>
    </div>;
  }

  return <></>;
}

export default VerifyEmail;
