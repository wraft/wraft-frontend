import React, { useState, useEffect, createContext, ReactElement } from 'react';
import { checkUser } from '../utils/models';
import { useStoreActions } from 'easy-peasy';
import { Flex, Spinner } from 'theme-ui';
import cookie from 'js-cookie';

interface IUserContextProps {
  isUserLoading: boolean;
}

export const UserContext = createContext<IUserContextProps>(
  {} as IUserContextProps,
);

export const UserProvider = ({ children }: { children: ReactElement }) => {
  const [isUserLoading, setIsUserLoading] = useState(false);
  const setToken = useStoreActions((actions: any) => actions.auth.addToken);
  const setProfile = useStoreActions(
    (actions: any) => actions.profile.updateProfile,
  );
  // console.log('dd');

  useEffect(() => {
    const token = cookie.get('token') || false;

    if (token) {
      setIsUserLoading(true);
      checkUser(
        token,
        (data: any) => {
          setProfile(data);
          setToken(token);
          setIsUserLoading(false);
        },
        () => {
          setIsUserLoading(false);
        },
      );
    }
  }, []);

  if (isUserLoading) {
    return (
      <Flex
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}>
        <Spinner width={32} />
      </Flex>
    );
  }
  return (
    <UserContext.Provider
      value={{
        isUserLoading: false,
      }}>
      {children}
    </UserContext.Provider>
  );
};
