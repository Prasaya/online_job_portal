import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

function VerifyEmail() {
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {}, []);

  return <></>;
}

export default VerifyEmail;
