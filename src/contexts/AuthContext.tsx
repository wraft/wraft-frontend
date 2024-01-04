import React, {
  useState,
  useEffect,
  createContext,
  ReactElement,
  useContext,
} from 'react';

import { useStoreActions } from 'easy-peasy';
import cookie from 'js-cookie';
import { Flex, Spinner } from 'theme-ui';

import { fetchUserInfo, fetchAPI } from '../utils/models';

interface IUserContextProps {
  isUserLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  userProfile: any;
  login: (data: any) => void;
  logout: () => void;
}

export const UserContext = createContext<IUserContextProps>(
  {} as IUserContextProps,
);

export const UserProvider = ({ children }: { children: ReactElement }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);

  const [isUserLoading, setIsUserLoading] = useState(false);
  const setToken = useStoreActions((actions: any) => actions.auth.addToken);
  const setProfile = useStoreActions(
    (actions: any) => actions.profile.updateProfile,
  );

  useEffect(() => {
    const refreshToken = cookie.get('refreshToken') || false;

    if (refreshToken) {
      setRefreshToken(refreshToken);
    }

    const token = cookie.get('token') || false;
    if (token) {
      setAccessToken(token);
      setToken(token);
      setIsUserLoading(true);

      console.log('accessToken', token);

      const fetchData = async () => {
        try {
          const userinfo: any = await fetchUserInfo();
          const userOrg: any = await fetchAPI('users/organisations');

          const currentOrg = userOrg?.organisations.find(
            (og: any) => og.id == userinfo?.organisation_id,
          );

          const body = {
            ...userProfile,
            ...userinfo,
            organisations: userOrg.organisations || [],
            currentOrganisation: currentOrg || {},
          };
          await updateUserData(body);
          setIsUserLoading(false);
        } catch {
          setIsUserLoading(false);
        }
      };

      fetchData();
    }
  }, []);

  const login = (data: any) => {
    const { access_token, refresh_token, user }: any = data;
    setAccessToken(access_token);
    setRefreshToken(refresh_token);
    setToken(access_token);
    setProfile(user);

    updateUserData(user);

    fetchAPI('users/organisations').then((res: any) => {
      const currentOrg = res?.organisations.find(
        (og: any) => og.id == user.organisation_id,
      );

      console.log('currentOrg', currentOrg);

      const body = {
        ...userProfile,
        ...user,
        organisations: res.organisations || [],
        currentOrganisation: currentOrg || {},
      };
      updateUserData(body);
    });

    cookie.set('token', access_token);
    cookie.set('refreshToken', refresh_token);
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUserProfile(null);
    setProfile(null);

    cookie.remove('token');
    cookie.remove('refreshToken');
  };

  const updateUserData = (userdata: any) => {
    setProfile(userdata);
    setUserProfile(userdata);
  };

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
        refreshToken,
        accessToken,
        userProfile,
        login,
        logout,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(UserContext);
};
