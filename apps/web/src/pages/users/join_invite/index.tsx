import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

import RegistrationForm from 'components/Auth/RegistrationForm';
import InviteAcceptBlock from 'components/InviteBlock/InviteAcceptBlock';
import InviteUnauthorizedBlock from 'components/InviteBlock/InviteUnauthorizedBlock';
import { useAuth } from 'contexts/AuthContext';
import { verifyInvite } from 'utils/models';

const Index = () => {
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get('token');
  const email = searchParams.get('email');

  const { accessToken, userProfile } = useAuth();
  const [isAuthorised, setIsAuthorised] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean | undefined>(undefined);
  const [verifyData, setVerifyData] = useState<any>();
  const [error, setError] = useState<any>();

  const router = useRouter();

  useEffect(() => {
    if (inviteToken) {
      verifyInviteToken(inviteToken);
    }
  }, [inviteToken]);

  const verifyInviteToken = async (token: any) => {
    try {
      setLoading(true);
      const response = await verifyInvite(token);

      setVerifyData(response);
      setLoading(false);
    } catch (err) {
      if (err.errors) {
        setError(err.errors);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken && email) {
      const checkAuthorised = userProfile?.email === email || false;
      setIsAuthorised(checkAuthorised);
    }
  }, []);

  if (loading === false && !accessToken && verifyData?.is_wraft_member) {
    const redirectUrl = encodeURIComponent(router.asPath);
    router.replace(`/login?redirect=${redirectUrl}`);

    return;
  }

  if (error) {
    return <InviteUnauthorizedBlock error={error} />;
  }

  return (
    <>
      {loading === false && !accessToken && !verifyData?.is_wraft_member && (
        <RegistrationForm inviteToken={inviteToken} />
      )}
      {loading === false && accessToken && (
        <InviteAcceptBlock
          isAuthorised={isAuthorised}
          inviteToken={inviteToken}
        />
      )}
    </>
  );
};
export default Index;
