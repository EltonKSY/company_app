import React, { createContext, useReducer } from 'react';

export const FullContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_READY':
      return { ...state, user: action.payload, authIsReady: true };
    case 'ALL_USERS':
      return { ...state, users: action.payload };
    default:
      return state;
  }
};

export const FullContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    authIsReady: false,
  });

  return <FullContext.Provider value={{ ...state, dispatch }}>{children}</FullContext.Provider>;
};
