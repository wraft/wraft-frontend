// components/JoinInvitationPage.js
import { useEffect } from 'react';
import { useStoreState } from 'easy-peasy';
import { useSearchParams } from 'next/navigation';
import RegistrationForm from '../../../components/RegistrationForm';
import Router from 'next/router';
import cookie from 'js-cookie';

// import { isAuthenticated, joinTeam, sendNotification } from '../api/auth'; // Replace with your authentication and notification logic

const Index = () => {
  const token = useStoreState((state) => state.auth.token);

  const searchParams = useSearchParams();
  const inviteToken = searchParams.get('token');
  const inviteOrganisation = searchParams.get('organisation');

  const myObject = {
    inviteToken: inviteToken,
    inviteOrganisation: inviteOrganisation,
  };

  useEffect(() => {
    // Serialize the object to a JSON string
    const objectString = JSON.stringify(myObject);

    // Set the cookie with the object string
    cookie.set('myCookie', objectString);
  }, []);

  console.log(inviteOrganisation);

  useEffect(() => {
    if (token && token.length > 10) {
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
      {!token ? (
        // Display a registration form for users to sign up
        <RegistrationForm inviteToken={inviteToken} />
      ) : (
        <div>Redirecting to Dashboard</div>
      )}
    </>
  );
};
export default Index;
