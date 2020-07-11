import {
    action,
    thunk
  } from "easy-peasy";
  
//   import config from "../config";
  import axios from "axios";
  
  const auth = {
    user: null,
    token: null,
    loading: false,
    grantAccess: action((state, payload) => {
  
      const token = payload.token;
      delete payload.token
  
      /** Set localStorage */
    //   localStorage.setItem('uCandidate', JSON.stringify(payload));
    //   localStorage.setItem('uToken', token);
  
      /** Set global user info */
      state.user = payload;
      state.token = token;
    }),
    login: thunk(async (actions, payload) =>
      await axios.post(config.app.api_url + '/login', JSON.stringify({
        email: payload.email.value,
        password: payload.password.value
      }), {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => actions.grantAccess(response.data))
      .catch(error => {
        console.log(error);
        message.error("Ah ocurrido un error, intente de nuevo.");
      })),
    logout: action(state => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('uToken');
      localStorage.removeItem('uCandidate');
    }),
    refreshToken: action((state) => {
      if(state.token) {
        console.log('Will refresh...');
      }
  
    })
  };
  
  export default auth;