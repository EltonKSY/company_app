/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useReducer, useEffect } from 'react';
import { useGetRows } from '../hooks/useGetRows';

export const FullContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_READY':
      return { ...state, user: action.payload };
    case 'ALL_USERS':
      return { ...state, users: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, users: [] };
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

    if (!isLoading && error === undefined) dispatch({ type: 'AUTH_READY', payload: currUser });
    state.authIsReady = true;
  }, [currUser, isLoading, error]);

  return <FullContext.Provider value={{ ...state, dispatch }}>{children}</FullContext.Provider>;
};
