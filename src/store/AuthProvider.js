import React, { createContext, useEffect, useReducer } from "react";

const actions = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
};

export const AuthContext = createContext({
  user: JSON.parse(localStorage.getItem("user")) || null,
  login: (user) => {},
  logout: () => {},
});

const AuthReducer = (state, action) => {
  switch (action.type) {
    case actions.LOGIN: {
      // console.log(action.payload);
      return {
        ...state,
        user: action.payload,
      };
    }

    case actions.LOGOUT: {
      return {
        ...state,
        user: null,
      };
    }
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, {
    user: JSON.parse(localStorage.getItem("user")) || null,
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  const login = (user) => {
    dispatch({ type: actions.LOGIN, payload: user });
  };

  const logout = () => {
    dispatch({ type: actions.LOGOUT });
  };
  return (
    <AuthContext.Provider value={{ user: state.user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
