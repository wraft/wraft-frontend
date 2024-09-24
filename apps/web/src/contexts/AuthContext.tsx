import React, {
  useState,
  useEffect,
  createContext,
  ReactElement,
  useContext,
} from 'react';
import { useRouter } from 'next/router';
import cookie from 'js-cookie';
import { signOut } from 'next-auth/react';
import { Flex, Spinner } from 'theme-ui';

import { fetchAPI } from 'utils/models';

interface IUserContextProps {
  isUserLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  permissions: string | null;
  userProfile: any;
  organisations: any;
  login: (data: any) => void;
  logout: () => void;
  updateOrganisations: any;
}

export const UserContext = createContext<IUserContextProps>(
  {} as IUserContextProps,
);

export const UserProvider = ({ children }: { children: ReactElement }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [organisations, setOrganisations] = useState<any | null>(null);
  const [permissions, setPermissions] = useState<any>(null);

  const router = useRouter();

  const [isUserLoading, setIsUserLoading] = useState(false);

  useEffect(() => {
    const cookieRefreshToken = cookie.get('refreshToken') || false;

    if (cookieRefreshToken) {
      setRefreshToken(cookieRefreshToken);
    }

    const token = cookie.get('token') || false;
    if (token) {
      setIsUserLoading(true);
      fetchUserBasicInfo();
      setAccessToken(token);
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
      setPermissions(permissionOrg.permissions);
      updateUserData(userinfo);
      setIsUserLoading(false);
    } catch {
      setIsUserLoading(false);
    }
  };

  const updateOrganisations = async () => {
    try {
      const userOrg: any = await fetchAPI('users/organisations');
      setOrganisations(userOrg.organisations);
    } catch (error) {
      console.error('Error fetching organisations:', error);
    }
  };

  const login = async (data: any) => {
    // setIsUserLoading(true);
    const { access_token, refresh_token }: any = data;
    await cookie.set('token', access_token);
    await cookie.set('refreshToken', refresh_token);

    await fetchUserBasicInfo();

    setAccessToken(access_token);
    setRefreshToken(refresh_token);
  };

  const logout = async (redirectUrl = '') => {
    try {
      await signOut({ redirect: false });

      setAccessToken(null);
      setRefreshToken(null);
      setUserProfile(null);
      setOrganisations(null);

      cookie.remove('token');
      cookie.remove('refreshToken');

      if (redirectUrl) {
        router.push(redirectUrl);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const updateUserData = (userdata: any) => {
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
        updateOrganisations,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(UserContext);
};
