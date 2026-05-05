// Holds a reference to Clerk's getToken function, set once inside React via useAuth()
let _getToken = null;

export const setGetToken = (fn) => {
  _getToken = fn;
};

export const getAuthToken = async () => {
  if (!_getToken) return null;
  return await _getToken();
};

//antigravity