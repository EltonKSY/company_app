import React, { createContext, useReducer, useEffect } from 'react';
import { useGetRows } from '../hooks/useGetRows';

export const FullContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_READY':
      return { ...state, user: action.payload, authIsReady: true };
    case 'ALL_USERS':
      return { ...state, users: action.payload };
    default:
      return state;
  }
};

export const FullContextProvider = ({ children }) => {
  //Gets
  const { rows: currUser, error, isLoading } = useGetRows('currUser');
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    authIsReady: false,
    users: [],
  });

  useEffect(() => {
    //If there exists a JWT, check if it is still valid and log the user in
    !isLoading && !error && dispatch({ type: 'AUTH_READY', payload: currUser });
  }, [currUser, isLoading, error]);

  return <FullContext.Provider value={{ ...state, dispatch }}>{children}</FullContext.Provider>;
};
