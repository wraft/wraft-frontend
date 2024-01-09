import axios from 'axios';
import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID ? process.env.GITHUB_ID : '',
    //   clientSecret: process.env.GITHUB_SECRET ? process.env.GITHUB_SECRET : '',
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID
        ? process.env.GOOGLE_CLIENT_ID
        : '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
        ? process.env.GOOGLE_CLIENT_SECRET
        : '',
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    // async jwt(token, user, account) {
    //   // If user is being created for the first time, fetch additional data from a backend API
    //   // if (account && account.provider === 'google' && user) {
    //   //   // const backendUserData = await fetchUserDataFromBackend(user.email);

    //   //   // Add additional data to the token
    //   //   token.user.name = 'wraftuser@gmail.com';
    //   //   // token.pp = {
    //   //   //   name: 'Monica Hill',
    //   //   //   email: 'wraftuser@gmail.com',
    //   //   // };
    //   // }

    //   return token;
    //   // return Promise.resolve(token);
    // },
    session: ({ session, user, token, ...props }) => {
      // console.log('session[b]', session);
      // console.log('session[user]', user);
      // console.log('session[props]', props);
      // console.log('session[token]', token);
      return {
        ...session,
        // bkn: token?.user || {},
      };
    },
    async signIn({ account, profile, ...props }) {
      if (account?.provider === 'google') {
        console.log('profile', profile);
        // console.log('account', account);
        // console.log('signIn', props);
        // const request = await axios.post(
        //   'https://evento-qo6d.onrender.com/api/v1/login/google',
        //   {
        //     email: profile?.email,
        //     // picture: profile?.picture,
        //     name: profile?.name,
        //   },
        // );
        // console.log('account[request]', request);
        // return Promise.resolve({ cutom: 'working' });
      }
      // return { cutom: 'working' };
      return true;
      // return true; // Do different verification for other providers that don't have `email_verified`
    },
    async jwt(props: any) {
    // async jwt({ token, account, ...props }) {
      console.log('account[token]', props);
      // console.log('account[account]', account);
      // console.log('account[account][b]', props);

      if (account?.access_token) {
        token.accessToken = account.access_token;
      }

      // token.user = {
      //   user: {
      //     id: 'af2cf1c6-f342-4042-8425-6346e9fd6c44',
      //     name: 'Monica Hill',
      //     email: 'wraftuser@gmail.com',
      //     inserted_at: '2023-10-24T10:46:33',
      //     updated_at: '2023-12-27T11:36:53',
      //     profile_pic:
      //       'https://dev-cdn.poetbin.com/wraft-dev/uploads/avatars/58ec434d-619f-41e3-875d-7eb0657457be/profilepic_Monica%20Hill.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=wraft-dev%2F20240104%2Flocal%2Fs3%2Faws4_request&X-Amz-Date=20240104T134407Z&X-Amz-Expires=300&X-Amz-SignedHeaders=host&X-Amz-Signature=be9ec30b67f447c28cecf3cb4bad7d6a4a1afdeb120fc6b0562e59015ab9ae03',
      //     organisation_id: '8514c831-3ae2-44e5-bad4-bd825814ce0c',
      //     roles: [
      //       {
      //         id: '31158377-6f9f-4968-9c1b-8846756de610',
      //         name: 'superadmin',
      //       },
      //     ],
      //     email_verify: true,
      //   },
      //   refresh_token:
      //     'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ3cmFmdF9kb2MiLCJleHAiOjE3MDQ1NDg2NDcsImlhdCI6MTcwNDM3NTg0NywiaXNzIjoid3JhZnRfZG9jIiwianRpIjoiYWE2YTlhODItMmRkNi00ZDIxLWI2NGEtZWQyMjIyNWY1ZjlhIiwibmJmIjoxNzA0Mzc1ODQ2LCJvcmdhbmlzYXRpb25faWQiOiI4NTE0YzgzMS0zYWUyLTQ0ZTUtYmFkNC1iZDgyNTgxNGNlMGMiLCJzdWIiOiJ3cmFmdHVzZXJAZ21haWwuY29tIiwidHlwIjoicmVmcmVzaCJ9.bjUB9OtHjJwSewMc6mV2RHsYpUmdFtioMIrRgxdE0fsGI9bmmMMwyFtnmLe9EPf_QzRkacW0e7eBmKqAvrh5AA',
      //   access_token:
      //     'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ3cmFmdF9kb2MiLCJleHAiOjE3MDQzODMwNDcsImlhdCI6MTcwNDM3NTg0NywiaXNzIjoid3JhZnRfZG9jIiwianRpIjoiMDc2ZTU3ZmUtMmNjYy00ZjE4LTliZmEtMWY3YTQyN2JmZjNkIiwibmJmIjoxNzA0Mzc1ODQ2LCJvcmdhbmlzYXRpb25faWQiOiI4NTE0YzgzMS0zYWUyLTQ0ZTUtYmFkNC1iZDgyNTgxNGNlMGMiLCJzdWIiOiJ3cmFmdHVzZXJAZ21haWwuY29tIiwidHlwIjoiYWNjZXNzIn0.fVmRagqT77tKUzOITIKH20HkL_4dZOWS7xeWy-5gzpvRfGvODiAvLGrcIR50060RBRsEToRXZQ3XhZvD4KCO9g',
      // };
      // return { ...token };
      return token;
    },
  },
});
