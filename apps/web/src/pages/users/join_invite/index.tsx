import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Router from 'next/router';
import cookie from 'js-cookie';

import RegistrationForm from 'components/RegistrationForm';
import { useAuth } from 'contexts/AuthContext';

const Index = () => {
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get('token');
  const inviteOrganisation = searchParams.get('organisation');

  const { accessToken } = useAuth();

  const myObject = {
    inviteToken: inviteToken,
    inviteOrganisation: inviteOrganisation,
  };

  useEffect(() => {
    // Serialize the object to a JSON string
    const objectString = JSON.stringify(myObject);

    // Set the cookie with the object string
    cookie.set('inviteCookie', objectString);
  }, []);

  useEffect(() => {
    if (accessToken) {
      Router.push('/');
    }
  }, []);

  // useEffect(() => {
  //   if (isAuthenticated()) {
  //     // User is already logged in
  //     // const user = getUser(); // Replace with your user retrieval logic
  //     if (user.hasJoinedTeam) {
  //       sendNotification('You are already a member of the team.');
  //     } else {
  //       sendNotification('Join the team now!');
  //     }
  //   }
  // }, []);

  return (
    <>
      {!accessToken ? (
        // Display a registration form for users to sign up
        <RegistrationForm inviteToken={inviteToken} />
      ) : (
        <div>Redirecting to Dashboard</div>
      )}
    </>
  );
};
export default Index;
