export const logOut = async (userCtx, navigate) => {
  const res = await fetch('/api/auth/logout', {
    method: 'POST',
  });
  const jsonVal = await res.json();
  if (jsonVal.success) {
    userCtx.updateUserStatus({
      authStatus: false,
      verifyStatus: false,
      id: '',
      type: '',
    });
    navigate('/login');
  }
};
