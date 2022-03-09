export const logIn = async (data, userCtx) => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const jsonVal = await res.json();
  const verifyRes = await fetch('/api/verify/status');
  const verifyData = await verifyRes.json();
  userCtx.updateUserStatus({
    authStatus: jsonVal.success,
    verifyStatus: verifyData.success ? verifyData.message : false,
    id: jsonVal.user.basics.id,
    type: jsonVal.user.basics.type,
  });
};
