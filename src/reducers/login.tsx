import cookie from 'js-cookie';

const initialState = {
  logged_in: false,
  token: '',
  checking: false,
};

const getCookie = () => {
  const c: string = cookie.get('token') as string;
  if (c && c.length > 10) {
    return c;
  } else {
    return false;
  }
};

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        loggin_in: true,
        payload: action.payload,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loggin_in: true,
        token: action.payload,
      };
    case 'LOGIN_FAILED':
      return {
        ...state,
        logged_in: false,
      };
    case 'LOGIN_CHECK':
      // eslint-disable-next-line no-case-declarations
      const token: any = getCookie();
      return {
        ...state,
        logged_in: false,
        checking: true,
        token: token,
      };
    default:
      return state;
  }
};

export default reducer;
