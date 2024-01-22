import React, {
  useState,
  useEffect,
  createContext,
  ReactElement,
  useContext,
} from 'react';

import { useStoreActions } from 'easy-peasy';
import cookie from 'js-cookie';
import { signOut } from 'next-auth/react';
import { Flex, Spinner } from 'theme-ui';

import { fetchAPI } from '../utils/models';

interface IUserContextProps {
  isUserLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  permissions: string | null;
  userProfile: any;
  organisations: any;
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
  const [organisations, setOrganisations] = useState<any | null>(null);
  const [permissions, setPermissions] = useState<any | null>(null);

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
      setIsUserLoading(true);
      fetchUserBasicInfo();
      setAccessToken(token);
      setToken(token);
    }
  }, []);

  useEffect(() => {
    if (userProfile?.organisation_id) {
      fetchAPI(`organisations/${userProfile.organisation_id}`).then((res) => {
        const body = {
          ...userProfile,
          currentOrganisation: res || {},
        };
        updateUserData(body);
      });
    }
  }, [userProfile?.organisation_id]);

  const fetchUserBasicInfo = async () => {
    try {
      const [userinfo, userOrg, permissionOrg]: any = await Promise.all([
        fetchAPI('users/me'),
        fetchAPI('users/organisations'),
        fetchAPI('organisations/users/permissions'),
      ]);

      setOrganisations(userOrg.organisations);
      setPermissions(permissionOrg);
      updateUserData(userinfo);
      setIsUserLoading(false);
    } catch {
      setIsUserLoading(false);
    }
  };

  console.log('user profile', userProfile);

  const login = async (data: any) => {
    // setIsUserLoading(true);
    const { access_token, refresh_token }: any = data;
    await cookie.set('token', access_token);
    await cookie.set('refreshToken', refresh_token);

    await fetchUserBasicInfo();

    setAccessToken(access_token);
    setRefreshToken(refresh_token);
    setToken(access_token);
  };

  const logout = async () => {
    await signOut({ redirect: false });
    setAccessToken(null);
    setRefreshToken(null);
    setUserProfile(null);
    setOrganisations(null);
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
        organisations,
        permissions,
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
